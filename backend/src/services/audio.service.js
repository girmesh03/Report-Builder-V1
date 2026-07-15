/**
 * Audio upload business logic.
 *
 * @module services/audio
 */
import fs from 'fs';
import Report from '../models/report.model.js';
import ApiError from '../utils/apiError.js';
import httpStatus from '../utils/httpStatus.js';
import constants from '../utils/constants.js';

/**
 * Attach an uploaded audio clip to a report and advance status to audio_recorded.
 *
 * @param {object} params
 * @param {string} params.reportId - Report ID
 * @param {string} params.userId - Owning user ID
 * @param {object} params.file - Multer file object
 * @param {object} params.metadata - { durationSeconds, mimeType, recordedAt, languageCode }
 * @param {object} [options] - { session }
 * @returns {Promise<object>} Updated report with audio clip metadata
 * @throws {ApiError} 404 if report not found or not owned
 */
export const attachAudioToReport = async ({ reportId, userId, file, metadata }, options = {}) => {
  const session = options.session || null;

  const report = await Report.findOne({ _id: reportId, user: userId }).session(session);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }

  if (
    ![constants.REPORT_STATUS.DRAFT, constants.REPORT_STATUS.AUDIO_RECORDED].includes(report.status) &&
    report.status !== constants.REPORT_STATUS.TRANSCRIBED &&
    report.status !== constants.REPORT_STATUS.TRANSCRIPTION_REVIEWED &&
    report.status !== constants.REPORT_STATUS.GENERATED &&
    report.status !== constants.REPORT_STATUS.FINALIZED
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Cannot attach audio to report in status "${report.status}"`);
  }

  const clip = {
    filename: file.filename,
    originalName: file.originalname,
    mimeType: metadata.mimeType || file.mimetype,
    size: file.size,
    duration: metadata.durationSeconds || 0,
    storagePath: file.path,
  };

  const hadTranscription = report.transcription.status !== constants.TASK_STATUS.PENDING;

  if (hadTranscription) {
    report.transcription = { status: constants.TASK_STATUS.PENDING };
    report.reviewedTranscription = '';
    report.reviewedAt = null;
    report.reviewerUserId = null;
    if (report.generatedReport) {
      report.generatedReport = { status: constants.TASK_STATUS.PENDING };
    }
  }

  report.audioClips.push(clip);
  report.status = constants.REPORT_STATUS.AUDIO_RECORDED;
  await report.save({ session });

  return {
    report: {
      _id: report._id,
      status: report.status,
      reportDate: report.reportDate,
      branches: report.branches,
      supervisorName: report.supervisorName,
    },
    clip,
  };
};

/**
 * Delete a single audio clip from a report and remove its file from disk.
 *
 * @param {object} report - Mongoose report document (must be loaded)
 * @param {string} clipId - ID of the clip to remove
 * @returns {Promise<object>} Updated report
 * @throws {ApiError} 404 if clip not found
 */
export const deleteAudioClip = async (report, clipId) => {
  const clip = report.audioClips.id(clipId);
  if (!clip) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Audio clip not found');
  }

  try {
    if (clip.storagePath && fs.existsSync(clip.storagePath)) {
      fs.unlinkSync(clip.storagePath);
    }
  } catch {
    // Silently ignore cleanup errors
  }

  const hadTranscription = report.transcription.status !== constants.TASK_STATUS.PENDING;

  report.audioClips.pull(clipId);

  if (hadTranscription) {
    report.transcription = { status: constants.TASK_STATUS.PENDING };
    report.reviewedTranscription = '';
    report.reviewedAt = null;
    report.reviewerUserId = null;
    if (report.generatedReport) {
      report.generatedReport = { status: constants.TASK_STATUS.PENDING };
    }
  }

  if (report.audioClips.length === 0) {
    report.status = constants.REPORT_STATUS.DRAFT;
  } else if (hadTranscription) {
    report.status = constants.REPORT_STATUS.AUDIO_RECORDED;
  }

  await report.save();

  return report;
};

/**
 * Delete all audio files associated with a report from disk.
 * Silently ignores missing files.
 *
 * @param {object} report - Mongoose report document
 * @returns {Promise<void>}
 */
export const deleteAllAudioFiles = async (report) => {
  for (const clip of report.audioClips || []) {
    if (clip.storagePath) {
      try {
        await fs.promises.unlink(clip.storagePath);
      } catch {
        // Silently ignore if file doesn't exist
      }
    }
  }
};
