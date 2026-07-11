/**
 * Audio upload API service.
 *
 * @module services/audioApi
 */
import apiClient from './apiClient.js';
import { API_CONFIG } from '../utils/constants.js';

/**
 * Upload recorded audio to a report.
 *
 * @param {string} reportId - Report ID
 * @param {Blob} audioBlob - Recorded audio blob
 * @param {object} metadata - { durationSeconds, mimeType }
 * @returns {Promise<object>} Response with report and clip metadata
 */
export async function uploadAudio(reportId, audioBlob, metadata = {}) {
  const formData = new FormData();
  const filename = `recording-${Date.now()}.${audioBlob.type.includes('webm') ? 'webm' : 'wav'}`;
  formData.append('audio', audioBlob, filename);

  if (metadata.durationSeconds) {
    formData.append('durationSeconds', String(metadata.durationSeconds));
  }
  if (metadata.mimeType) {
    formData.append('mimeType', metadata.mimeType);
  }
  formData.append('recordedAt', new Date().toISOString());
  formData.append('languageCode', 'am');

  const res = await fetch(`${API_CONFIG.BASE_URL}/reports/${reportId}/audio`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Upload failed' }));
    const details = Array.isArray(err.data)
      ? err.data.map((e) => `${e.field}: ${e.message}`).join('; ')
      : Array.isArray(err.errors)
        ? err.errors.map((e) => `${e.path || e.field}: ${e.msg || e.message}`).join('; ')
        : '';
    throw new Error(details || err.message || `Upload failed with status ${res.status}`);
  }

  return res.json();
}

export default uploadAudio;
