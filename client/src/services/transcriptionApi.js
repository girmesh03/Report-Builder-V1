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
