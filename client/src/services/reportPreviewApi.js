/**
 * Report preview API service.
 *
 * @module services/reportPreviewApi
 */
import apiClient from './apiClient.js';

/**
 * Get report preview data.
 *
 * @param {string} reportId
 * @returns {Promise<object>}
 */
export const getReportPreview = async (reportId) => {
  return apiClient(`/reports/${reportId}/preview`);
};

/**
 * Save edited report content.
 *
 * @param {string} reportId
 * @param {string} editedReport
 * @returns {Promise<object>}
 */
export const saveEditedReport = async (reportId, editedReport) => {
  return apiClient(`/reports/${reportId}/generated-report`, {
    method: 'PATCH',
    body: { editedReport },
  });
};

/**
 * Finalize a report.
 *
 * @param {string} reportId
 * @returns {Promise<object>}
 */
export const finalizeReport = async (reportId) => {
  return apiClient(`/reports/${reportId}/finalize`, {
    method: 'POST',
  });
};
