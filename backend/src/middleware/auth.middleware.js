/**
 * JWT authentication and role-based authorization middleware.
 *
 * @module middleware/auth
 */
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../services/token.service.js';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import httpStatus from '../utils/httpStatus.js';

/**
 * Authenticate request by verifying access token from httpOnly cookie.
 *
 * Attaches `req.user` on success (user object from DB).
 *
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 * @throws {ApiError} 401 if token is missing, invalid, or user not found
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required', 'Authentication required. Please login.');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Session expired. Please login again.', 'Your session has expired. Please login again.');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid session. Please login again.', 'Your session is invalid. Please login again.');
    }
    throw error;
  }

  const user = await User.findById(decoded.userId).select('-passwordHash');

  if (!user || !user.isActive) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found or deactivated');
  }

  req.user = user;
  next();
});

/**
 * Authorize request based on user role.
 *
 * Must be used after `authenticate` middleware.
 *
 * @param  {...string} roles - Allowed roles
 * @returns {import('express').RequestHandler} Express middleware
 */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
    }
    next();
  };
};
