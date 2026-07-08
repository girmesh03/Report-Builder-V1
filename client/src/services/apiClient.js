/**
 * API client wrapper.
 *
 * Uses native fetch with credentials for cookie-based auth.
 * Automatically handles 401 responses by attempting token refresh.
 * If refresh fails, throws a SESSION_EXPIRED error.
 *
 * @module services/apiClient
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

const AUTH_SKIP_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

/**
 * Make an API request.
 *
 * @param {string} endpoint - API path (e.g. '/auth/login')
 * @param {object} [options] - Fetch options
 * @param {string} [options.method] - HTTP method
 * @param {object} [options.body] - Request body
 * @param {object} [options.headers] - Additional headers
 * @returns {Promise<object>} Parsed JSON response
 * @throws {Error} On network failure, non-OK status, or session expiry
 */
const apiClient = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers = {} } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  };

  if (body) {
    config.body = JSON.stringify(body);
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
