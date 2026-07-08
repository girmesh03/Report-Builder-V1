/**
 * Standardised success response helper.
 *
 * @module utils/apiResponse
 */

/**
 * Sends a standardised JSON success response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {*} [data] - Optional response payload
 * @returns {void}
 */
const apiResponse = (res, statusCode, message, data) => {
  const body = { success: true, message };
  if (data !== undefined) {
    body.data = data;
  }
  res.status(statusCode).json(body);
};

export default apiResponse;
