/**
 * express-validator validation result middleware.
 *
 * Checks for validation errors and returns a 422 response if any are found.
 *
 * @module middleware/validate
 */
import { validationResult } from 'express-validator';
import httpStatus from '../utils/httpStatus.js';
import apiResponse from '../utils/apiResponse.js';

/**
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    apiResponse(res, httpStatus.UNPROCESSABLE_ENTITY, 'Validation failed', formatted);
    return;
  }
  next();
};

export default validate;
