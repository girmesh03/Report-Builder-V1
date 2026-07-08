/**
 * JWT authentication and role-based authorization middleware.
 *
 * @module middleware/auth
 */
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
export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user || !user.isActive) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found or deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
    }
  }
};

/**
 * Authorize request based on user role.
 *
 * Must be used after `authenticate` middleware.
 *
 * @param  {...string} roles - Allowed roles
 * @returns {import('express').RequestHandler} Express middleware
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
    }
    next();
  };
};
