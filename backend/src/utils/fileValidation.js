/**
 * File validation utilities for audio upload.
 *
 * @module utils/fileValidation
 */

const ALLOWED_AUDIO_MIME_TYPES = Object.freeze([
  'audio/wav',
  'audio/x-wav',
  'audio/wave',
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/webm',
]);

const MAX_AUDIO_SIZE = 10 * 1024 * 1024;

/**
 * Addis AI STT per-request duration limit in seconds.
 *
 * Audio files exceeding this limit are chunked by the backend
 * before being sent to STT (WAV only; other formats sent as-is).
 *
 * @type {number}
 */
export const STT_CHUNK_DURATION_SECONDS = 60;

/**
 * Check if a MIME type is in the allowed audio types.
 *
 * @param {string} mimeType - File MIME type
 * @returns {boolean}
 */
export function isAllowedAudioMime(mimeType) {
  const baseType = mimeType.split(';')[0].trim();
  return ALLOWED_AUDIO_MIME_TYPES.includes(baseType);
}

/**
 * Check if file size is within the 10 MB limit.
 *
 * @param {number} bytes - File size in bytes
 * @returns {boolean}
 */
export function isValidAudioSize(bytes) {
  return bytes > 0 && bytes <= MAX_AUDIO_SIZE;
}

export { ALLOWED_AUDIO_MIME_TYPES, MAX_AUDIO_SIZE };
