/**
 * Profile business logic.
 *
 * @module services/profile
 */
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import httpStatus from '../utils/httpStatus.js';

/**
 * Get a user's public profile.
 *
 * @param {string} userId - User ID
 * @param {object} [options] - { session }
 * @returns {Promise<object>} Public profile
 * @throws {ApiError} 404 if user not found
 */
export const getProfile = async (userId, options = {}) => {
  const session = options.session || null;
  const user = await User.findById(userId).session(session);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user.toPublicProfile();
};

/**
 * Update profile fields (name, phone, avatarUrl).
 *
 * @param {string} userId - User ID
 * @param {object} updates - Fields to update
 * @param {object} [options] - { session }
 * @returns {Promise<object>} Updated public profile
 * @throws {ApiError} 400 if no valid fields provided
 */
export const updateProfile = async (userId, updates, options = {}) => {
  const session = options.session || null;

  const allowedFields = ['name', 'phone', 'avatarUrl'];
  const cleanUpdates = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      cleanUpdates[field] = updates[field];
    }
  }

  if (Object.keys(cleanUpdates).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No valid fields to update');
  }

  const user = await User.findByIdAndUpdate(userId, cleanUpdates, {
    new: true,
    runValidators: true,
    session,
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user.toPublicProfile();
};

/**
 * Change a user's password.
 *
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password for verification
 * @param {string} newPassword - New password
 * @param {object} [options] - { session }
 * @returns {Promise<void>}
 * @throws {ApiError} 400 if current password is incorrect
 */
export const changePassword = async (userId, currentPassword, newPassword, options = {}) => {
  const session = options.session || null;

  const user = await User.findById(userId).session(session);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Current password is incorrect');
  }

  user.passwordHash = newPassword;
  await user.save({ session });
};
