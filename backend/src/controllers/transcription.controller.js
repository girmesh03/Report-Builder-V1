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
import { transcribeAudio } from '../services/ai/addisAiStt.service.js';

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
