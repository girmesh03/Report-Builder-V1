/**
 * Audio upload business logic.
 *
 * @module services/audio
 */
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

  if (report.status !== constants.REPORT_STATUS.DRAFT) {
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
