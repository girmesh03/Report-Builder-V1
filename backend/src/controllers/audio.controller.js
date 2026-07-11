/**
 * Audio upload controller.
 *
 * Handles authenticated audio file upload for a specific report.
 *
 * @module controllers/audio
 */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import fs from 'fs';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import { attachAudioToReport } from '../services/audio.service.js';
import { isValidAudioDuration } from '../utils/fileValidation.js';

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

  const durationSeconds = req.body.durationSeconds ? parseFloat(req.body.durationSeconds) : undefined;
  if (durationSeconds !== undefined && !isValidAudioDuration(durationSeconds)) {
    cleanupFile(file.path);
    apiResponse(res, httpStatus.BAD_REQUEST, 'Duration exceeds the 60-second limit');
    return;
  }

  const metadata = {
    durationSeconds: durationSeconds || 0,
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
