/**
 * Standardised success response helper.
 *
 * @module utils/apiResponse
 */

/**
 * Sends a standardised JSON response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {*} [data] - Optional response payload
 * @param {boolean} [success=true] - Whether the response indicates success
 * @returns {void}
 */
const apiResponse = (res, statusCode, message, data, success = true) => {
  const body = { success, message };
  if (data !== undefined) {
    body.data = data;
  }
  res.status(statusCode).json(body);
};

export default apiResponse;
