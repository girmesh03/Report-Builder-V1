/**
 * Addis AI Speech-to-Text service.
 *
 * Transcribes all audio clips for a report using Addis AI STT.
 * Each clip is individually chunked and transcribed; results are
 * accumulated into a single transcription text with overlap-aware
 * deduplication.
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

/** @type {number} Overlap in seconds between adjacent STT chunks for context preservation */
const STT_OVERLAP_SECONDS = 2;

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
 * Merge two adjacent chunk transcriptions by removing overlapped text.
 *
 * Detects the overlapping region between the end of the previous chunk
 * and the start of the next chunk using character-level and word-level
 * suffix/prefix matching. This prevents duplicate words at chunk boundaries.
 *
 * @param {string} prevText - Full transcription of the prior chunk(s)
 * @param {string} nextText - Full transcription of the current chunk
 * @param {number} overlapSeconds - Duration of overlap in seconds
 * @returns {string} nextText with overlapping prefix removed (or full text if no match)
 */
function mergeOverlappingTexts(prevText, nextText, overlapSeconds) {
  if (!overlapSeconds || !prevText || !nextText) return nextText;

  const maxOverlapChars = overlapSeconds * 15;

  const searchLen = Math.min(
    maxOverlapChars * 2,
    prevText.length,
    nextText.length
  );

  for (let len = searchLen; len >= 3; len--) {
    const suffix = prevText.slice(-len);
    if (nextText.startsWith(suffix)) {
      return nextText.slice(len);
    }
  }

  const prevWords = prevText.split(/\s+/);
  const nextWords = nextText.split(/\s+/);
  const maxWords = Math.min(Math.ceil(overlapSeconds * 4), prevWords.length, nextWords.length);

  for (let i = maxWords; i >= 1; i--) {
    const prevSuffix = prevWords.slice(-i).join(' ');
    const nextPrefix = nextWords.slice(0, i).join(' ');
    if (prevSuffix === nextPrefix) {
      return nextWords.slice(i).join(' ');
    }
  }

  return nextText;
}

/**
 * Transcribe all audio clips for a report.
 *
 * Iterates every clip in the report's audioClips array. Each clip is
 * chunked and transcribed separately; all transcription text is combined
 * with overlap-aware deduplication into a single `transcription.text` field.
 *
 * @param {object} params
 * @param {string} params.reportId - Report ID
 * @param {string} params.userId - Owning user ID
 * @returns {Promise<object>} Combined transcription result with metadata
 * @throws {ApiError} 404 if report not found or not owned
 * @throws {ApiError} 400 if report has no audio or invalid status
 */
export async function transcribeAudio({ reportId, userId }) {
  const report = await Report.findOne({ _id: reportId, user: userId });
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }

  const canTranscribe =
    report.status === constants.REPORT_STATUS.AUDIO_RECORDED ||
    report.status === constants.REPORT_STATUS.TRANSCRIBED ||
    report.status === constants.REPORT_STATUS.TRANSCRIPTION_REVIEWED ||
    report.status === constants.REPORT_STATUS.GENERATED ||
    report.status === constants.REPORT_STATUS.FINALIZED;

  if (!canTranscribe) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Cannot transcribe report in status "${report.status}". Audio must be recorded first.`
    );
  }

  if (!report.audioClips || report.audioClips.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Report has no audio clips to transcribe.');
  }

  const languageCode = env.ADDIS_AI_STT_LANGUAGE_CODE || 'am';

  let transcriptionText = '';
  let totalConfidence = 0;
  let totalChunks = 0;
  let requestId = '';
  let totalBilledDuration = 0;
  const clipResults = [];

  for (const clip of report.audioClips) {
    if (!clip.storagePath) {
      logger.warn('Skipping clip with missing storagePath', { clipId: clip._id });
      continue;
    }

    let chunks;
    try {
      chunks = await chunkAudio(clip.storagePath, undefined, STT_OVERLAP_SECONDS);
    } catch (err) {
      logger.error('Audio chunking failed for clip', {
        reportId,
        clipId: clip._id,
        error: err.message,
      });
      report.transcription = {
        text: transcriptionText,
        confidence: totalChunks > 0 ? totalConfidence / totalChunks : 0,
        languageCode,
        requestId: requestId || '',
        billedDuration: totalBilledDuration,
        status: constants.TASK_STATUS.FAILED,
        errorMessage: `Clip ${clip._id} chunking failed: ${err.message}`,
      };
      await report.save();
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Audio clip could not be processed for transcription. Ensure ffmpeg is installed or use a shorter recording.`
      );
    }

    let clipText = '';
    let clipChunks = 0;
    let clipConfidence = 0;
    const clipChunkTexts = [];

    for (const chunk of chunks) {
      const formData = new FormData();
      const requestData = {
        language_code: languageCode,
      };
      if (env.ADDIS_AI_STT_MODEL) {
        requestData.model = env.ADDIS_AI_STT_MODEL;
      }
      requestData.temperature = 0.0;

      const blob = chunkBlob(chunk.buffer, clip.mimeType);
      formData.append('audio', blob, clip.filename || 'audio');
      formData.append('request_data', JSON.stringify(requestData));

      let providerResponse;
      try {
        providerResponse = await post('/api/v2/stt', formData);
      } catch (err) {
        report.transcription = {
          text: transcriptionText + (clipText ? ' ' + clipText : ''),
          confidence: totalChunks > 0 ? totalConfidence / totalChunks : 0,
          languageCode,
          requestId: requestId || '',
          billedDuration: totalBilledDuration,
          status: constants.TASK_STATUS.FAILED,
          errorMessage: `Clip chunk ${chunk.index + 1}/${chunks.length} failed: ${err.message}`,
        };
        await report.save();
        throw err;
      }

      const chunkText = providerResponse?.data?.transcription || '';
      const chunkRequestId = providerResponse?.data?.usage_metadata?.requestId || '';
      const chunkBilledStr = providerResponse?.data?.usage_metadata?.totalBilledDuration || '0s';
      const chunkBilled = parseFloat(chunkBilledStr) || 0;
      const chunkConfidence = typeof providerResponse?.confidence === 'number' ? providerResponse.confidence : 0;

      clipChunkTexts.push(chunkText);
      clipConfidence += chunkConfidence;
      clipChunks++;
      requestId = chunkRequestId || requestId;
      totalBilledDuration += chunkBilled;

      logger.info('STT chunk transcribed', {
        reportId,
        clipId: clip._id,
        chunk: chunk.index + 1,
        total: chunks.length,
        requestId: chunkRequestId,
        billedDuration: chunkBilled,
      });
    }

    for (let i = 0; i < clipChunkTexts.length; i++) {
      if (i === 0) {
        clipText = clipChunkTexts[i];
      } else {
        const merged = mergeOverlappingTexts(clipChunkTexts[i - 1], clipChunkTexts[i], STT_OVERLAP_SECONDS);
        if (clipText) {
          clipText += ' ';
        }
        clipText += merged;
      }
    }

    if (transcriptionText) {
      transcriptionText += ' ';
    }
    transcriptionText += clipText;
    totalConfidence += clipConfidence;
    totalChunks += clipChunks;

    clipResults.push({
      clipId: clip._id,
      text: clipText,
      chunkCount: clipChunks,
    });

    logger.info('Clip transcribed', {
      reportId,
      clipId: clip._id,
      clipTextLength: clipText.length,
      chunks: clipChunks,
    });
  }

  const confidence = totalChunks > 0 ? totalConfidence / totalChunks : 0;

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
    totalChunks,
    clipCount: report.audioClips.length,
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
    clips: clipResults,
  };
}
