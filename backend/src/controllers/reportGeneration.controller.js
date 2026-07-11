/**
 * Report generation controller.
 *
 * Handles saving reviewed transcription and triggering AI report generation.
 * Write operations use try/catch/finally with MongoDB sessions.
 *
 * NOTE on session pattern: The saveReviewedTranscription endpoint uses a full
 * session lifecycle (start → transaction → commit → end). The generateReport
 * endpoint commits the transaction BEFORE the external AI API call because:
 *   1. The AI call can take 30-60s+ — holding a transaction open for that
 *      duration is an anti-pattern (blocks reads, increases lock contention).
 *   2. The reviewed transcription is already saved at that point — committing
 *      early preserves it even if the AI call fails.
 *   3. The final save (generatedReport) is a single-document atomic MongoDB
 *      operation — it does not need a transaction.
 *
 * @module controllers/reportGeneration
 */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import constants from '../utils/constants.js';
import Report from '../models/report.model.js';
import ApiError from '../utils/apiError.js';
import logger from '../utils/logger.js';
import { generateText } from '../services/ai/addisAiText.service.js';
import { buildReportPrompt } from '../services/reportPrompt.service.js';

/**
 * Save reviewed transcription.
 *
 * Persists the user-edited transcription separately from the raw STT output,
 * tracks who reviewed it and when, and advances report status to transcription_reviewed.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route PATCH /api/v1/reports/:reportId/transcriptions/review
 */
export const saveReviewedTranscription = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const report = await Report.findOne({
      _id: req.params.reportId,
      user: req.user._id.toString(),
    }).session(session);

    if (!report) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
    }

    if (report.status !== constants.REPORT_STATUS.TRANSCRIBED) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot review transcription in status "${report.status}". Report must be in "transcribed" status.`
      );
    }

    report.reviewedTranscription = req.body.reviewedTranscription;
    report.reviewedAt = new Date();
    report.reviewerUserId = req.user._id;
    report.status = constants.REPORT_STATUS.TRANSCRIPTION_REVIEWED;

    await report.save({ session });
    await session.commitTransaction();

    apiResponse(res, httpStatus.OK, 'Reviewed transcription saved', {
      reportId: report._id,
      status: report.status,
      reviewedAt: report.reviewedAt,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Generate AI report.
 *
 * Takes the reviewed transcription, builds a structured prompt, sends it
 * to Addis AI text generation, and persists the result.
 *
 * The session is committed before the long-running AI call (see module doc).
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route POST /api/v1/reports/:reportId/generate
 */
export const generateReport = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const report = await Report.findOne({
      _id: req.params.reportId,
      user: req.user._id.toString(),
    }).populate('branches', 'name code').session(session);

    if (!report) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
    }

    if (report.status !== constants.REPORT_STATUS.TRANSCRIPTION_REVIEWED) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot generate report in status "${report.status}". Review transcription first.`
      );
    }

    if (!report.reviewedTranscription || !report.reviewedTranscription.trim()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Reviewed transcription is empty. Please save a reviewed transcription before generating.'
      );
    }

    // Commit transaction before long-running AI call
    session.commitTransaction();

    const { prompt, promptVersion } = buildReportPrompt(report, report.reviewedTranscription);

    let generationResult;
    try {
      generationResult = await generateText(prompt);
    } catch (err) {
      report.generatedReport = {
        text: '',
        modelVersion: '',
        promptVersion,
        finishReason: 'error',
        inputTokens: 0,
        outputTokens: 0,
        status: constants.TASK_STATUS.FAILED,
        errorMessage: err.message,
      };
      await report.save();
      throw err;
    }

    report.generatedReport = {
      text: generationResult.text,
      modelVersion: generationResult.modelVersion,
      promptVersion,
      finishReason: generationResult.finishReason,
      inputTokens: generationResult.inputTokens,
      outputTokens: generationResult.outputTokens,
      status: constants.TASK_STATUS.COMPLETED,
      errorMessage: '',
    };
    report.status = constants.REPORT_STATUS.GENERATED;

    await report.save();

    logger.info('Report generated', {
      reportId: report._id,
      modelVersion: generationResult.modelVersion,
      promptVersion,
      inputTokens: generationResult.inputTokens,
      outputTokens: generationResult.outputTokens,
      finishReason: generationResult.finishReason,
    });

    apiResponse(res, httpStatus.OK, 'Report generated successfully', {
      reportId: report._id,
      status: report.status,
      generatedReport: report.generatedReport,
    });
  } catch (error) {
    next(error);
  } finally {
    session.endSession();
  }
});
