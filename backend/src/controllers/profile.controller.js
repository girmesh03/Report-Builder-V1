/**
 * Profile controller.
 *
 * @module controllers/profile
 */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import * as profileService from '../services/profile.service.js';

/**
 * Get the current user's profile.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @route GET /api/v1/profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfile(req.user._id.toString());
  apiResponse(res, httpStatus.OK, 'Profile retrieved', profile);
});

/**
 * Update profile fields (name, phone, avatarUrl).
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route PATCH /api/v1/profile
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const profile = await profileService.updateProfile(
      req.user._id.toString(),
      req.body,
      { session },
    );
    await session.commitTransaction();
    apiResponse(res, httpStatus.OK, 'Profile updated', profile);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Change password.
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @route PATCH /api/v1/profile/password
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await profileService.changePassword(
      req.user._id.toString(),
      req.body.currentPassword,
      req.body.newPassword,
      { session },
    );
    await session.commitTransaction();
    apiResponse(res, httpStatus.OK, 'Password changed successfully');
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});
