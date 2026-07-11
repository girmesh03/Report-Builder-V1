/**
 * Audio utility functions.
 *
 * @module utils/audioUtils
 */

const MIME_PRIORITY = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
];

/** @type {number} */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Minimum file size for meaningful audio (2 KB).
 *
 * Recordings smaller than this are unlikely to contain speech and
 * are treated as silent/empty per edge case documented in phase-7-summary.
 *
 * @type {number}
 */
const MIN_AUDIO_SIZE = 2 * 1024;

/**
 * Detect the best supported MIME type for MediaRecorder.
 *
 * Tries MIME types in priority order per ADR-005.
 *
 * @returns {string} Best supported MIME type or empty string (browser default)
 */
export function getSupportedMimeType() {
  for (const mime of MIME_PRIORITY) {
    if (MediaRecorder.isTypeSupported(mime)) {
      return mime;
    }
  }
  return '';
}

/**
 * Format duration in seconds to mm:ss string.
 *
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Format file size in bytes to human-readable string.
 *
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string (e.g. "2.5 MB")
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Check if file size exceeds the 10 MB limit.
 *
 * @param {number} bytes - File size in bytes
 * @returns {boolean} True if file exceeds the limit
 */
export function isOverSizeLimit(bytes) {
  return bytes > MAX_FILE_SIZE;
}

/**
 * Check if file size is below the minimum threshold for meaningful audio.
 *
 * Recordings < 2 KB are almost certainly silent/empty and should be
 * rejected before submission.
 *
 * @param {number} bytes - File size in bytes
 * @returns {boolean} True if recording is likely silent/empty
 */
export function isSilentRecording(bytes) {
  return bytes < MIN_AUDIO_SIZE;
}


