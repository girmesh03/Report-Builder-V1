/**
 * Audio upload request validation rules.
 *
 * @module validators/audio
 */
import { body } from 'express-validator';

const MIME_PATTERN = /^audio\//;

export const uploadAudioRules = [
  body('durationSeconds')
    .optional()
    .isFloat({ min: 0.1, max: 60 })
    .withMessage('Duration must be between 0.1 and 60 seconds'),

  body('mimeType')
    .optional()
    .isString()
    .matches(MIME_PATTERN)
    .withMessage('MIME type must be an audio type'),

  body('recordedAt')
    .optional()
    .isISO8601()
    .withMessage('RecordedAt must be a valid ISO 8601 date'),

  body('languageCode')
    .optional()
    .isString()
    .isLength({ min: 2, max: 10 })
    .withMessage('Language code must be 2-10 characters'),
];
