/**
 * Auth business logic.
 *
 * @module services/auth
 */
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './token.service.js';
import ApiError from '../utils/apiError.js';
import httpStatus from '../utils/httpStatus.js';
import { accessTokenCookieOptions, refreshTokenCookieOptions } from '../utils/cookieOptions.js';

/**
 * Register a new user.
 *
 * @param {object} data - { name, email, password }
 * @param {object} [options] - { session }
 * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
 * @throws {ApiError} 409 if email already exists
 */
export const registerUser = async (data, options = {}) => {
  const session = options.session || null;

  const existing = await User.findOne({ email: data.email }).session(session);
  if (existing) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already registered');
  }

  const user = await User.create(
    [{ name: data.name, email: data.email, passwordHash: data.password }],
    { session }
  );

  const payload = { userId: user[0]._id.toString(), role: user[0].role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ userId: user[0]._id.toString() });

  return { user: user[0].toPublicProfile(), accessToken, refreshToken };
};

/**
 * Login with email and password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
 * @throws {ApiError} 401 if credentials are invalid
 * @throws {ApiError} 401 if account is deactivated
 */
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Account is deactivated');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  user.lastLoginAt = new Date();
  await user.save();

  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  return { user: user.toPublicProfile(), accessToken, refreshToken };
};

/**
 * Refresh access and refresh tokens using a valid refresh token.
 *
 * @param {string} token - Refresh JWT
 * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
 * @throws {ApiError} 401 if token is invalid or user not found
 */
export const refreshUserToken = async (token) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found or deactivated');
  }

  const payload = { userId: user._id.toString(), role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  return { user: user.toPublicProfile(), accessToken, refreshToken };
};

/**
 * Build cookie options array for setting auth cookies in the response.
 *
 * @param {string} accessToken
 * @param {string} refreshToken
 * @returns {Array<{ name: string, value: string, options: object }>}
 */
export const buildAuthCookies = (accessToken, refreshToken) => [
  { name: 'accessToken', value: accessToken, options: accessTokenCookieOptions },
  { name: 'refreshToken', value: refreshToken, options: refreshTokenCookieOptions },
];

/**
 * Build cookie options for clearing auth cookies (logout).
 *
 * @returns {Array<{ name: string, value: string, options: object }>}
 */
export const buildClearCookieOptions = () => [
  { name: 'accessToken', value: '', options: { ...accessTokenCookieOptions, maxAge: 0 } },
  { name: 'refreshToken', value: '', options: { ...refreshTokenCookieOptions, maxAge: 0 } },
];
