/**
 * Transcription controller.
 *
 * Handles requesting AI transcription for uploaded report audio.
 * Uses a direct save (no MongoDB transaction) because:
 *   1. It's a single-document update to the report.
 *   2. The operation includes long-running external HTTP calls
 *      (Addis AI STT, up to 60s+ per chunk) — holding a
 *      transaction open for that duration is an anti-pattern.
 *   3. On failure, the partial/failure state must persist so
 *      the user can retry without losing the failure record.
 *
 * @module controllers/transcription
 */
import asyncHandler from 'express-async-handler';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import constants from '../utils/constants.js';
import Report from '../models/report.model.js';
import { transcribeAudio } from '../services/ai/addisAiStt.service.js';
import { reviewTranscription } from '../services/ai/addisAiTranscriptionReview.service.js';

/**
 * Request transcription for a report's audio clip.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Express next function
 * @route POST /api/v1/reports/:reportId/transcriptions
 */
export const requestTranscription = asyncHandler(async (req, res, _next) => {
  const clipId = req.body.clipId || undefined;

  const result = await transcribeAudio({
    reportId: req.params.reportId,
    userId: req.user._id.toString(),
    clipId,
  });

  apiResponse(res, httpStatus.OK, 'Transcription completed successfully', result);
});

/**
 * Review transcription by AI for improved accuracy.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Express next function
 * @route POST /api/v1/reports/:reportId/transcriptions/review-by-ai
 */
export const reviewByAI = asyncHandler(async (req, res, _next) => {
  const { transcription, feedback } = req.body;

  const result = await reviewTranscription(transcription, feedback);

  apiResponse(res, httpStatus.OK, 'AI transcription review completed', result);
});

/**
 * Re-review transcription with user feedback for iterative improvement.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Express next function
 * @route POST /api/v1/reports/:reportId/transcriptions/re-review
 */
export const reReviewByAI = asyncHandler(async (req, res, _next) => {
  const { currentTranscription, userFeedback } = req.body;

  const result = await reviewTranscription(currentTranscription, userFeedback);

  apiResponse(res, httpStatus.OK, 'AI transcription re-review completed', result);
});

/**
 * Delete transcription from a report.
 *
 * Resets transcription, reviewedTranscription, and rolls status back
 * to audio_recorded (or draft if no audio clips remain).
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} _next - Express next function
 * @route DELETE /api/v1/reports/:reportId/transcriptions
 */
export const deleteTranscription = asyncHandler(async (req, res, _next) => {
  const report = await Report.findOne({
    _id: req.params.reportId,
    user: req.user._id.toString(),
  });
  if (!report) {
    apiResponse(res, httpStatus.NOT_FOUND, 'Report not found');
    return;
  }

  if (report.status === 'draft' || report.status === 'audio_recorded') {
    apiResponse(res, httpStatus.BAD_REQUEST, 'No transcription to delete');
    return;
  }

  report.transcription = { status: constants.TASK_STATUS.PENDING };
  report.reviewedTranscription = '';
  report.reviewedAt = null;
  report.reviewerUserId = null;
  report.status = report.audioClips.length > 0
    ? constants.REPORT_STATUS.AUDIO_RECORDED
    : constants.REPORT_STATUS.DRAFT;
  await report.save();

  apiResponse(res, httpStatus.OK, 'Transcription deleted', {
    _id: report._id,
    status: report.status,
  });
});
