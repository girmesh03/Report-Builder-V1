/**
 * Custom operational error class for consistent error responses.
 *
 * @module utils/apiError
 */

/**
 * Represents an operational error with a status code.
 *
 * @extends Error
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message (technical)
   * @param {string} [userMessage=''] - User-friendly error message (falls back to technical)
   * @param {boolean} [isOperational=true] - Whether the error is operational
   * @param {string} [stack] - Optional stack trace
   */
  constructor(statusCode, message, userMessage = '', isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.userMessage = userMessage || message;
    this.technicalMessage = message;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
