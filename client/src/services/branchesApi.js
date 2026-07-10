/**
 * Branches API service.
 *
 * @module services/branchesApi
 */
import apiClient from './apiClient.js';

/**
 * @param {object} params
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {string} [params.search]
 * @param {string} [params.sort]
 * @returns {Promise<object>}
 */
export const listBranches = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });
  const qs = query.toString();
  const endpoint = `/branches${qs ? `?${qs}` : ''}`;
  return apiClient(endpoint);
};

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export const getBranch = async (id) => {
  return apiClient(`/branches/${id}`);
};
