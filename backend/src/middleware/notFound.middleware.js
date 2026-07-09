/**
 * 404 handler middleware.
 *
 * Catches unmatched routes and forwards a 404 ApiError.
 *
 * @module middleware/notFound
 */
import httpStatus from '../utils/httpStatus.js';
import ApiError from '../utils/apiError.js';

/**
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
const notFound = (req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, `Route not found: ${req.originalUrl}`));
};

export default notFound;
