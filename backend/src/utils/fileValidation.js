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
const MAX_AUDIO_DURATION = 60;

/**
 * Check if a MIME type is in the allowed audio types.
 *
 * @param {string} mimeType - File MIME type
 * @returns {boolean}
 */
export function isAllowedAudioMime(mimeType) {
  return ALLOWED_AUDIO_MIME_TYPES.includes(mimeType);
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

/**
 * Check if the reported duration is within the 60-second limit.
 *
 * Client metadata is not fully trusted — this is a soft guard.
 *
 * @param {number} seconds - Duration in seconds
 * @returns {boolean}
 */
export function isValidAudioDuration(seconds) {
  return typeof seconds === 'number' && seconds > 0 && seconds <= MAX_AUDIO_DURATION;
}

export { ALLOWED_AUDIO_MIME_TYPES, MAX_AUDIO_SIZE, MAX_AUDIO_DURATION };
