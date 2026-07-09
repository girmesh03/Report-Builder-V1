/**
 * Branch controller.
 *
 * @module controllers/branch
 */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import * as branchService from '../services/branch.service.js';

/**
 * List branches with pagination.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @route GET /api/v1/branches
 */
export const getBranches = asyncHandler(async (req, res) => {
  const result = await branchService.listBranches(req.query);
  apiResponse(res, httpStatus.OK, 'Branches retrieved', result);
});

/**
 * Get a single branch by ID.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @route GET /api/v1/branches/:id
 */
export const getBranch = asyncHandler(async (req, res) => {
  const branch = await branchService.getBranchById(req.params.id);
  apiResponse(res, httpStatus.OK, 'Branch retrieved', branch);
});

/**
 * Create a new branch.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 * @route POST /api/v1/branches
 */
export const createBranch = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const branch = await branchService.createBranch(req.body, { session });
    await session.commitTransaction();
    apiResponse(res, httpStatus.CREATED, 'Branch created', branch);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Update a branch.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 * @route PATCH /api/v1/branches/:id
 */
export const updateBranch = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const branch = await branchService.updateBranch(req.params.id, req.body, { session });
    await session.commitTransaction();
    apiResponse(res, httpStatus.OK, 'Branch updated', branch);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Deactivate a branch (soft delete).
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 * @route DELETE /api/v1/branches/:id
 */
export const deactivateBranch = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const branch = await branchService.deactivateBranch(req.params.id, { session });
    await session.commitTransaction();
    apiResponse(res, httpStatus.OK, 'Branch deactivated', branch);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});
