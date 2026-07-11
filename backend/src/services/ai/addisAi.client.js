/**
 * Addis AI HTTP client.
 *
 * Base HTTP client for Addis AI API calls using native Node fetch.
 * Handles authentication header, timeout, and error parsing.
 *
 * @module services/ai/addisAiClient
 */
import env from '../../config/env.js';
import logger from '../../utils/logger.js';
import { mapProviderError } from './aiProviderErrors.js';

const BASE_URL = env.ADDIS_AI_BASE_URL;
const API_KEY = env.ADDIS_AI_API_KEY;
const TIMEOUT_MS = env.ADDIS_AI_TIMEOUT_MS;

/**
 * Send a POST request to the Addis AI API.
 *
 * @param {string} endpoint - API path (e.g. /api/v2/stt)
 * @param {FormData|string} body - Request body
 * @param {string} [contentType] - Content-Type header (omit for FormData)
 * @returns {Promise<object>} Parsed JSON response body on success
 * @throws {ApiError} Mapped provider error on failure
 */
export async function post(endpoint, body, contentType) {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'x-api-key': API_KEY,
  };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      logger.error('Addis AI request timed out', { endpoint, timeoutMs: TIMEOUT_MS });
      throw mapProviderError(503);
    }
    logger.error('Addis AI network error', { endpoint, error: err.message });
    throw mapProviderError(503);
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    let errorBody = null;
    try {
      errorBody = await response.json();
    } catch {
      // Response not JSON
    }

    const providerCode = errorBody?.error?.code || null;
    const providerMsg = errorBody?.error?.message || null;

    logger.error('Addis AI request failed', {
      endpoint,
      statusCode: response.status,
      providerCode,
      providerMessage: providerMsg,
      requestId: errorBody?.data?.usage_metadata?.requestId || null,
    });

    throw mapProviderError(response.status);
  }

  const data = await response.json();

  if (data?.status === 'error') {
    const providerCode = data?.error?.code || null;
    logger.error('Addis AI returned error status', {
      endpoint,
      providerCode,
      requestId: data?.data?.usage_metadata?.requestId || null,
    });
    throw mapProviderError(500);
  }

  return data;
}
