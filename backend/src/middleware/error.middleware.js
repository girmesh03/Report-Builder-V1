/**
 * Global error handler middleware.
 *
 * Returns consistent JSON error responses.
 *
 * @module middleware/error
 */
import httpStatus from '../utils/httpStatus.js';
import apiResponse from '../utils/apiResponse.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * @param {ApiError|Error} err - Error object
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (!err.isOperational) {
    logger.error('Unexpected error', { error: err.message, stack: err.stack });
  }

  const data = env.NODE_ENV === 'development' ? { stack: err.stack } : undefined;
  apiResponse(res, statusCode, message, data);
};

export default errorHandler;
