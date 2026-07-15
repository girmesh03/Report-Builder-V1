/**
 * Audio upload API service.
 *
 * All endpoints use apiClient which handles 401 → refresh → retry
 * and session expiry. FormData body is detected automatically
 * so Content-Type is omitted (browser sets multipart boundary).
 *
 * @module services/audioApi
 */
import apiClient from './apiClient.js';

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

  return apiClient(`/reports/${reportId}/audio`, {
    method: 'POST',
    body: formData,
  });
}

/**
 * Delete a single audio clip from a report.
 *
 * @param {string} reportId - Report ID
 * @param {string} clipId - Clip ID to delete
 * @returns {Promise<object>} Response with updated report info
 */
export async function deleteClip(reportId, clipId) {
  return apiClient(`/reports/${reportId}/audio/${clipId}`, {
    method: 'DELETE',
  });
}

export default uploadAudio;
