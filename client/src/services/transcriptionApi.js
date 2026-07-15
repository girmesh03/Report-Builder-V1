/**
 * Transcription API service.
 *
 * @module services/transcriptionApi
 */
import apiClient from './apiClient.js';

/**
 * Request AI transcription for a report's audio clip.
 *
 * @param {string} reportId - Report ID
 * @param {object} [options] - { clipId }
 * @returns {Promise<object>} Response with transcription data
 */
export async function requestTranscription(reportId, options = {}) {
  const body = {};
  if (options.clipId) {
    body.clipId = options.clipId;
  }

  return apiClient(`/reports/${reportId}/transcriptions`, {
    method: 'POST',
    body,
  });
}

/**
 * Get transcription status from a report object.
 *
 * @param {object} report - Report object from API
 * @returns {{ status: string, text: string, confidence: number, billedDuration: number }}
 */
export function getTranscriptionInfo(report) {
  const t = report?.transcription || {};
  return {
    status: t.status || 'pending',
    text: t.text || '',
    confidence: t.confidence || 0,
    billedDuration: t.billedDuration || 0,
    requestId: t.requestId || '',
    languageCode: t.languageCode || '',
    errorMessage: t.errorMessage || '',
  };
}

/**
 * Send raw transcription to AI for review/correction.
 *
 * @param {string} reportId - Report ID
 * @param {string} transcription - Raw transcription text
 * @returns {Promise<object>} Response with reviewedText and changes
 */
export async function reviewTranscriptionByAI(reportId, transcription) {
  return apiClient(`/reports/${reportId}/transcriptions/review-by-ai`, {
    method: 'POST',
    body: { transcription },
  });
}

/**
 * Re-review transcription with user feedback for iterative improvement.
 *
 * @param {string} reportId - Report ID
 * @param {string} currentTranscription - Current transcription text
 * @param {string} userFeedback - User feedback on what to improve
 * @returns {Promise<object>} Response with reviewedText and changes
 */
export async function reReviewTranscription(reportId, currentTranscription, userFeedback) {
  return apiClient(`/reports/${reportId}/transcriptions/re-review`, {
    method: 'POST',
    body: { currentTranscription, userFeedback },
  });
}

/**
 * Delete transcription from a report.
 *
 * Resets report status back to audio_recorded (or draft if no clips).
 *
 * @param {string} reportId - Report ID
 * @returns {Promise<object>} Response with updated report info
 */
export async function deleteTranscription(reportId) {
  return apiClient(`/reports/${reportId}/transcriptions`, {
    method: 'DELETE',
  });
}
