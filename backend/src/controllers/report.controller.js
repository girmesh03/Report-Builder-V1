/**
 * Report controller.
 *
 * @module controllers/report
 */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import * as reportService from '../services/report.service.js';

/**
 * List reports with pagination (scoped to authenticated user).
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @route GET /api/v1/reports
 */
export const getReports = asyncHandler(async (req, res) => {
  const result = await reportService.listReports(
    { ...req.query, userId: req.user._id.toString() },
  );
  apiResponse(res, httpStatus.OK, 'Reports retrieved', result);
});

/**
 * Get a single report by ID (scoped to authenticated user).
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @route GET /api/v1/reports/:id
 */
export const getReport = asyncHandler(async (req, res) => {
  const report = await reportService.getReportById(req.params.id, req.user._id.toString());
  apiResponse(res, httpStatus.OK, 'Report retrieved', report);
});

/**
 * Create a new draft report.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route POST /api/v1/reports
 */
export const createReport = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const report = await reportService.createReport(req.body, req.user, { session });
    await session.commitTransaction();
    apiResponse(res, httpStatus.CREATED, 'Report created', report);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Update a report (scoped to authenticated user).
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route PATCH /api/v1/reports/:id
 */
export const updateReport = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const report = await reportService.updateReport(
      req.params.id,
      req.user._id.toString(),
      req.body,
      { session },
    );
    await session.commitTransaction();
    apiResponse(res, httpStatus.OK, 'Report updated', report);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Delete a draft report (scoped to authenticated user).
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route DELETE /api/v1/reports/:id
 */
export const deleteReport = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const report = await reportService.deleteReport(
      req.params.id,
      req.user._id.toString(),
      { session },
    );
    await session.commitTransaction();
    apiResponse(res, httpStatus.OK, 'Report deleted', report);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Get a monthly compiled summary report.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @route GET /api/v1/reports/monthly?year=&month=
 */
export const getMonthlyReport = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const month = parseInt(req.query.month, 10) || (new Date().getMonth() + 1);

  const result = await reportService.generateMonthlyReport(
    req.user._id.toString(),
    year,
    month,
  );

  apiResponse(res, httpStatus.OK, 'Monthly report generated', result);
});

/**
 * Export reports within a date range.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @route GET /api/v1/reports/export?dateFrom=&dateTo=
 */
export const exportReportsByDate = asyncHandler(async (req, res) => {
  const { dateFrom, dateTo } = req.query;

  const result = await reportService.exportReportsByDateRange(
    req.user._id.toString(),
    dateFrom,
    dateTo,
  );

  apiResponse(res, httpStatus.OK, 'Reports exported', result);
});
