/**
 * Report preview controller.
 *
 * Handles preview retrieval, edited report saving, and finalization.
 * Write operations use try/catch/finally with MongoDB sessions.
 *
 * @module controllers/reportPreview
 */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import constants from '../utils/constants.js';
import Report from '../models/report.model.js';
import ApiError from '../utils/apiError.js';

/**
 * Get report preview data.
 *
 * Returns full report metadata, branches, reviewed transcription summary,
 * generated report, edited report, and status for the preview page.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route GET /api/v1/reports/:reportId/preview
 */
export const getReportPreview = asyncHandler(async (req, res, next) => {
  const report = await Report.findOne({
    _id: req.params.reportId,
    user: req.user._id.toString(),
  }).populate('branches', 'name code');

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Report not found');
  }

  apiResponse(res, httpStatus.OK, 'Report preview retrieved', {
    _id: report._id,
    reportDate: report.reportDate,
    branches: report.branches,
    status: report.status,
    supervisorName: report.supervisorName,
    notes: report.notes,
    languageMode: report.languageMode,
    transcription: report.transcription,
    reviewedTranscription: report.reviewedTranscription,
    reviewedAt: report.reviewedAt,
    generatedReport: report.generatedReport,
    editedReport: report.editedReport,
    editedAt: report.editedAt,
    exportHistory: report.exportHistory,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  });
});

/**
 * Save edited report content.
 *
 * Stores user edits to the generated report in the `editedReport` field
 * and updates `editedAt`. Does not advance status — editing is separate
 * from finalization.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route PATCH /api/v1/reports/:reportId/generated-report
 */
export const saveEditedReport = asyncHandler(async (req, res, next) => {
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

    const editableStatuses = [
      constants.REPORT_STATUS.GENERATED,
      constants.REPORT_STATUS.FINALIZED,
    ];

    if (!editableStatuses.includes(report.status)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot edit report in status "${report.status}". Report must be in "generated" or "finalized" status.`
      );
    }

    const hasContent = report.generatedReport?.text || report.editedReport;
    if (!hasContent) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'No generated report content to edit. Please generate the report first.'
      );
    }

    report.editedReport = req.body.editedReport;
    report.editedAt = new Date();

    await report.save({ session });
    await session.commitTransaction();

    apiResponse(res, httpStatus.OK, 'Edited report saved', {
      reportId: report._id,
      editedAt: report.editedAt,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Finalize a report.
 *
 * Sets the report status to `finalized`. Requires the report to be in
 * "generated" status and have either `generatedReport.text` or
 * `editedReport` content.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route POST /api/v1/reports/:reportId/finalize
 */
export const finalizeReport = asyncHandler(async (req, res, next) => {
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

    if (report.status !== constants.REPORT_STATUS.GENERATED) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Cannot finalize report in status "${report.status}". Report must be in "generated" status.`
      );
    }

    const hasContent = report.generatedReport?.text || report.editedReport;
    if (!hasContent) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Cannot finalize an empty report. Please generate the report first.'
      );
    }

    report.status = constants.REPORT_STATUS.FINALIZED;

    await report.save({ session });
    await session.commitTransaction();

    apiResponse(res, httpStatus.OK, 'Report finalized successfully', {
      reportId: report._id,
      status: report.status,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});
