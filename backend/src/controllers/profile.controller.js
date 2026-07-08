/**
 * Profile controller.
 *
 * @module controllers/profile
 */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import apiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import httpStatus from '../utils/httpStatus.js';

/**
 * Get the current user's profile.
 *
 * @route GET /api/v1/profile
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  apiResponse(res, httpStatus.OK, 'Profile retrieved', user.toPublicProfile());
});

/**
 * Update profile fields (name, phone, avatarUrl).
 *
 * @route PATCH /api/v1/profile
 */
export const updateProfile = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const allowedFields = ['name', 'phone', 'avatarUrl'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No valid fields to update');
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    apiResponse(res, httpStatus.OK, 'Profile updated', user.toPublicProfile());
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
 * @route PATCH /api/v1/profile/password
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await User.findById(req.user._id).session(session);
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Current password is incorrect');
    }

    user.passwordHash = req.body.newPassword;
    await user.save({ session });

    await session.commitTransaction();
    apiResponse(res, httpStatus.OK, 'Password changed successfully');
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});
