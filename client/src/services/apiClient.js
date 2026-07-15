/**
 * API client wrapper.
 *
 * Uses native fetch with credentials for cookie-based auth.
 * Automatically handles 401 responses by attempting token refresh.
 * If refresh fails, dispatches session expiry via registered callback.
 *
 * Supports both JSON and FormData bodies. When body is FormData,
 * Content-Type is omitted (browser sets multipart boundary) and
 * the body is sent as-is.
 *
 * @module services/apiClient
 */

import { API_CONFIG } from '../utils/constants.js';

const BASE_URL = API_CONFIG.BASE_URL;

const AUTH_SKIP_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

/** @type {(() => void) | null} */
let onSessionExpired = null;

/**
 * Register a callback invoked when a session expires.
 *
 * Used by the Redux store to dispatch clearAuth without creating
 * a circular dependency between apiClient and the store.
 *
 * @param {(() => void) | null} fn
 */
export const setOnSessionExpired = (fn) => {
  onSessionExpired = fn;
};

/**
 * Make an API request.
 *
 * @param {string} endpoint - API path (e.g. '/auth/login')
 * @param {object} [options] - Fetch options
 * @param {string} [options.method] - HTTP method
 * @param {object|FormData} [options.body] - Request body (object for JSON, FormData for multipart)
 * @param {object} [options.headers] - Additional headers
 * @returns {Promise<object>} Parsed JSON response
 * @throws {Error} On network failure, non-OK status, or session expiry
 */
const apiClient = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers = {} } = options;

  const isFormData = body instanceof FormData;

  const config = {
    method,
    headers: isFormData ? { ...headers } : { 'Content-Type': 'application/json', ...headers },
    credentials: 'include',
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch {
    throw new Error('Network error — please check your connection');
  }

  if (response.status === 401 && !AUTH_SKIP_REFRESH.includes(endpoint)) {
    let refreshRes;
    try {
      refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      if (onSessionExpired) onSessionExpired();
      const error = new Error('Session expired. Please log in again.');
      error.status = 401;
      error.code = 'SESSION_EXPIRED';
      throw error;
    }

    if (refreshRes.ok) {
      try {
        response = await fetch(`${BASE_URL}${endpoint}`, config);
      } catch {
        throw new Error('Network error — please check your connection');
      }
    } else {
      if (onSessionExpired) onSessionExpired();
      const error = new Error('Session expired. Please log in again.');
      error.status = 401;
      error.code = 'SESSION_EXPIRED';
      throw error;
    }
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export default apiClient;
