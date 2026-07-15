/**
 * Reports API service.
 *
 * @module services/reportsApi
 */
import apiClient from './apiClient.js';

/**
 * @param {object} params
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {string} [params.search]
 * @param {string} [params.status]
 * @param {string} [params.branch]
 * @param {string} [params.dateFrom]
 * @param {string} [params.dateTo]
 * @param {string} [params.sort]
 * @returns {Promise<object>}
 */
export const listReports = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  const endpoint = `/reports${qs ? `?${qs}` : ''}`;
  return apiClient(endpoint);
};

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getReport = async (id) => {
  return apiClient(`/reports/${id}`);
};

/**
 * @param {object} data
 * @returns {Promise<object>}
 */
export const createReport = async (data) => {
  return apiClient('/reports', {
    method: 'POST',
    body: data,
  });
};

/**
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>}
 */
export const updateReport = async (id, data) => {
  return apiClient(`/reports/${id}`, {
    method: 'PATCH',
    body: data,
  });
};

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const deleteReport = async (id) => {
  return apiClient(`/reports/${id}`, {
    method: 'DELETE',
  });
};

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const archiveReport = async (id) => {
  return apiClient(`/reports/${id}/archive`, {
    method: 'PATCH',
  });
};

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const recoverReport = async (id) => {
  return apiClient(`/reports/${id}/recover`, {
    method: 'POST',
  });
};

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const permanentDeleteReport = async (id) => {
  return apiClient(`/reports/${id}/permanent`, {
    method: 'DELETE',
  });
};
