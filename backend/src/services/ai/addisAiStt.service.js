/**
 * Addis AI Speech-to-Text service.
 *
 * Transcribes uploaded audio clips using Addis AI STT.
 * Supports transparent chunking for long recordings and
 * re-transcription for testing accuracy.
 *
 * @module services/ai/addisAiStt
 */
import constants from '../../utils/constants.js';
import Report from '../../models/report.model.js';
import ApiError from '../../utils/apiError.js';
import httpStatus from '../../utils/httpStatus.js';
import logger from '../../utils/logger.js';
import { post } from './addisAi.client.js';
import { chunkAudio } from './audioChunker.js';
import env from '../../config/env.js';

/**
 * Build a Blob with the correct MIME type for a chunk buffer.
 *
 * After ffmpeg conversion + WAV split, chunks are pcm_s16le WAV
 * (RIFF header). The original clip MIME type (e.g. audio/webm) is
 * wrong for these — tell the provider it's WAV so it decodes correctly.
 *
 * @param {Buffer} buffer - Chunk buffer
 * @param {string} fallbackMime - Fallback MIME (original clip mimeType)
 * @returns {Blob}
 */
function chunkBlob(buffer, fallbackMime) {
  const isWav = buffer.length >= 4 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 &&
    buffer[2] === 0x46 && buffer[3] === 0x46;
  return new Blob([buffer], { type: isWav ? 'audio/wav' : (fallbackMime || 'audio/webm') });
}

/**
 * Transcribe the latest (or specified) audio clip for a report.
 *
 * First-time transcription requires status `audio_recorded`.
 * Re-transcription is allowed when status is `transcribed` or
 * when a previous transcription attempt failed (status remains
 * `audio_recorded` with `transcription.status === 'failed'`).
 *
 * @param {object} params
 * @param {string} params.reportId - Report ID
 * @param {string} params.userId - Owning user ID
 * @param {string} [params.clipId] - Optional specific clip ID to transcribe
 * @returns {Promise<object>} Transcription result with metadata
 * @throws {ApiError} 404 if report not found or not owned
 * @throws {ApiError} 400 if report has no audio or invalid status
 */
export async function transcribeAudio({ reportId, userId, clipId }) {
  const report = await Report.findOne({ _id: reportId, user: userId });
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }

  const canTranscribe =
    report.status === constants.REPORT_STATUS.AUDIO_RECORDED ||
    report.status === constants.REPORT_STATUS.TRANSCRIBED;

  if (!canTranscribe) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Cannot transcribe report in status "${report.status}". Audio must be recorded first.`
    );
  }

  if (!report.audioClips || report.audioClips.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Report has no audio clips to transcribe.');
  }

  let clip;
  if (clipId) {
    clip = report.audioClips.id(clipId);
    if (!clip) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Audio clip not found.');
    }
  } else {
    clip = report.audioClips[report.audioClips.length - 1];
  }

  if (!clip.storagePath) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Audio file path is missing.');
  }

  const languageCode = env.ADDIS_AI_STT_LANGUAGE_CODE || 'am';

  let chunks;
  try {
    chunks = await chunkAudio(clip.storagePath);
  } catch (err) {
    logger.error('Audio chunking failed', {
      storagePath: clip.storagePath,
      error: err.message,
    });
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Audio could not be processed for transcription. Ensure ffmpeg is installed or use a shorter recording.'
    );
  }

  let transcriptionText = '';
  let totalConfidence = 0;
  let chunkCount = 0;
  let requestId = '';
  let totalBilledDuration = 0;

  for (const chunk of chunks) {
    const formData = new FormData();
    const requestData = JSON.stringify({ language_code: languageCode });
    const blob = chunkBlob(chunk.buffer, clip.mimeType);
    formData.append('audio', blob, clip.filename || 'audio');
    formData.append('request_data', requestData);

    let providerResponse;
    try {
      providerResponse = await post('/api/v2/stt', formData);
    } catch (err) {
      report.transcription = {
        text: transcriptionText,
        confidence: chunkCount > 0 ? totalConfidence / chunkCount : 0,
        languageCode,
        requestId: requestId || '',
        billedDuration: totalBilledDuration,
        status: constants.TASK_STATUS.FAILED,
        errorMessage: `Chunk ${chunk.index + 1}/${chunks.length} failed: ${err.message}`,
      };
      await report.save();
      throw err;
    }

    const chunkText = providerResponse?.data?.transcription || '';
    const chunkRequestId = providerResponse?.data?.usage_metadata?.requestId || '';
    const chunkBilledStr = providerResponse?.data?.usage_metadata?.totalBilledDuration || '0s';
    const chunkBilled = parseFloat(chunkBilledStr) || 0;
    const chunkConfidence = typeof providerResponse?.confidence === 'number' ? providerResponse.confidence : 0;

    if (transcriptionText) {
      transcriptionText += ' ';
    }
    transcriptionText += chunkText;
    totalConfidence += chunkConfidence;
    chunkCount++;
    requestId = chunkRequestId || requestId;
    totalBilledDuration += chunkBilled;

    logger.info('STT chunk transcribed', {
      reportId,
      chunk: chunk.index + 1,
      total: chunks.length,
      requestId: chunkRequestId,
      billedDuration: chunkBilled,
    });
  }

  const confidence = chunkCount > 0 ? totalConfidence / chunkCount : 0;

  report.transcription = {
    text: transcriptionText,
    confidence,
    languageCode,
    requestId,
    billedDuration: totalBilledDuration,
    status: constants.TASK_STATUS.COMPLETED,
    errorMessage: '',
  };
  report.status = constants.REPORT_STATUS.TRANSCRIBED;
  await report.save();

  logger.info('Transcription completed', {
    reportId,
    requestId,
    billedDuration: totalBilledDuration,
    confidence,
    chunkCount,
    status: 'completed',
  });

  return {
    reportId: report._id,
    status: report.status,
    transcription: {
      text: transcriptionText,
      confidence,
      languageCode,
      requestId,
      billedDuration: totalBilledDuration,
      status: constants.TASK_STATUS.COMPLETED,
    },
  };
}
