/**
 * Authentication controller.
 *
 * @module controllers/auth
 */
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import apiResponse from '../utils/apiResponse.js';
import httpStatus from '../utils/httpStatus.js';
import {
  registerUser,
  loginUser,
  refreshUserToken,
  buildAuthCookies,
  buildClearCookieOptions,
} from '../services/auth.service.js';
import { getOAuthProviders } from '../services/oauth.service.js';

/**
 * Register a new user.
 *
 * Sets access and refresh tokens as httpOnly cookies.
 *
 * @route POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await registerUser(req.body, { session });
    await session.commitTransaction();

    const cookies = buildAuthCookies(result.accessToken, result.refreshToken);
    cookies.forEach(({ name, value, options }) => {
      res.cookie(name, value, options);
    });

    apiResponse(res, httpStatus.CREATED, 'Registration successful', result.user);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * Login with email and password.
 *
 * Sets access and refresh tokens as httpOnly cookies.
 *
 * @route POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res, next) => {
  try {
    const result = await loginUser(req.body.email, req.body.password);

    const cookies = buildAuthCookies(result.accessToken, result.refreshToken);
    cookies.forEach(({ name, value, options }) => {
      res.cookie(name, value, options);
    });

    apiResponse(res, httpStatus.OK, 'Login successful', result.user);
  } catch (error) {
    next(error);
  }
});

/**
 * Logout by clearing auth cookies.
 *
 * @route POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  const clearCookies = buildClearCookieOptions();
  clearCookies.forEach(({ name, value, options }) => {
    res.cookie(name, value, options);
  });
  apiResponse(res, httpStatus.OK, 'Logout successful');
});

/**
 * Refresh access token using refresh token cookie.
 *
 * @route POST /api/v1/auth/refresh
 */
export const refresh = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return apiResponse(res, httpStatus.UNAUTHORIZED, 'Refresh token required');
    }

    const result = await refreshUserToken(token);

    const cookies = buildAuthCookies(result.accessToken, result.refreshToken);
    cookies.forEach(({ name, value, options }) => {
      res.cookie(name, value, options);
    });

    apiResponse(res, httpStatus.OK, 'Token refreshed', result.user);
  } catch (error) {
    next(error);
  }
});

/**
 * Get the currently authenticated user's profile.
 *
 * @route GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  apiResponse(res, httpStatus.OK, 'User retrieved', req.user.toPublicProfile());
});

/**
 * Get the list of configured OAuth providers.
 *
 * @route GET /api/v1/auth/oauth/providers
 */
export const getOAuthProvidersList = asyncHandler(async (req, res) => {
  const providers = getOAuthProviders();
  apiResponse(res, httpStatus.OK, 'OAuth providers retrieved', { providers });
});
