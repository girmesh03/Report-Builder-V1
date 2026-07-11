/**
 * Audio upload controller.
 *
 * Handles authenticated audio file upload for a specific report.
 * Duration metadata is informational only — no hard duration limit on upload.
 * Long recordings exceeding Addis AI STT per-request duration (60s)
 * are chunked by the STT service at transcription time.
 *
 * @module controllers/audio
 */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import fs from 'fs';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import { attachAudioToReport } from '../services/audio.service.js';

/**
 * Upload audio and attach it to a report.
 *
 * Expects multipart/form-data with field name "audio".
 * Optional metadata fields: durationSeconds, mimeType, recordedAt, languageCode.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route POST /api/v1/reports/:reportId/audio
 */
export const uploadAudio = asyncHandler(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    apiResponse(res, httpStatus.BAD_REQUEST, 'Audio file is required');
    return;
  }

  const metadata = {
    durationSeconds: req.body.durationSeconds ? parseFloat(req.body.durationSeconds) : 0,
    mimeType: req.body.mimeType || file.mimetype,
    recordedAt: req.body.recordedAt || new Date().toISOString(),
    languageCode: req.body.languageCode || 'am',
  };

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await attachAudioToReport({
      reportId: req.params.reportId,
      userId: req.user._id.toString(),
      file,
      metadata,
    }, { session });

    await session.commitTransaction();
    apiResponse(res, httpStatus.OK, 'Audio uploaded successfully', result);
  } catch (error) {
    await session.abortTransaction();
    cleanupFile(file.path);
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Remove a file from disk.
 *
 * @param {string} filePath
 * @returns {void}
 */
function cleanupFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Silently ignore cleanup errors
  }
}
