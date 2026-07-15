/**
 * Addis AI provider error mapping.
 *
 * Maps provider HTTP status codes to safe user-facing messages
 * and ApiError instances. Never exposes internal provider details.
 *
 * @module services/ai/aiProviderErrors
 */
import ApiError from '../../utils/apiError.js';
import httpStatus from '../../utils/httpStatus.js';

const ERROR_MAP = Object.freeze({
  400: { status: httpStatus.BAD_REQUEST, message: 'Something went wrong processing your request. Please try again.' },
  401: { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'The AI service is not configured correctly. Please contact your system administrator.' },
  403: { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'The AI service is not configured correctly. Please contact your system administrator.' },
  404: { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'AI service endpoint not found. Please contact support.' },
  429: { status: httpStatus.TOO_MANY_REQUESTS, message: 'AI service is busy. Please try again later.' },
  500: { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'AI service is temporarily unavailable. Please try again later.' },
  503: { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'AI service is temporarily unavailable. Please try again later.' },
});

const DEFAULT_ERROR = { status: httpStatus.INTERNAL_SERVER_ERROR, message: 'AI service encountered an unexpected error. Please try again later.' };

/**
 * Map an Addis AI HTTP status code to an ApiError.
 *
 * @param {number} providerStatusCode - HTTP status from Addis AI response
 * @returns {ApiError}
 */
export function mapProviderError(providerStatusCode) {
  const entry = ERROR_MAP[providerStatusCode] || DEFAULT_ERROR;
  return new ApiError(entry.status, entry.message);
}
