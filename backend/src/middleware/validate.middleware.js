/**
 * express-validator validation result middleware.
 *
 * Checks for validation errors and returns a 422 response if any are found.
 *
 * @module middleware/validate
 */
import { validationResult } from 'express-validator';
import httpStatus from '../utils/httpStatus.js';

/**
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Express next function
 * @returns {void}
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
    return;
  }
  next();
};

export default validate;
