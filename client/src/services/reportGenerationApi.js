/**
 * Report generation API service.
 *
 * @module services/reportGenerationApi
 */
import apiClient from './apiClient.js';

/**
 * Save reviewed transcription.
 *
 * @param {string} reportId - Report ID
 * @param {string} reviewedTranscription - The user-edited transcription text
 * @returns {Promise<object>} Response with status and reviewedAt
 */
export async function saveReviewedTranscription(reportId, reviewedTranscription) {
  return apiClient(`/reports/${reportId}/transcriptions/review`, {
    method: 'PATCH',
    body: { reviewedTranscription },
  });
}

/**
 * Generate AI report from reviewed transcription.
 *
 * @param {string} reportId - Report ID
 * @returns {Promise<object>} Response with generated report data
 */
export async function generateReport(reportId) {
  return apiClient(`/reports/${reportId}/generate`, {
    method: 'POST',
    body: {},
  });
}
