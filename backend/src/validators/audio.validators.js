/**
 * Audio upload request validation rules.
 *
 * @module validators/audio
 */
import { body } from 'express-validator';

const MIME_PATTERN = /^audio\//;

/** @type {import('express-validator').ValidationChain[]} */
export const uploadAudioRules = [
  body('durationSeconds')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Duration must be a non-negative number'),

  body('mimeType')
    .optional()
    .isString()
    .matches(MIME_PATTERN)
    .withMessage('MIME type must be an audio type'),

  body('recordedAt')
    .optional()
    .isString()
    .notEmpty()
    .withMessage('RecordedAt must be a non-empty string'),

  body('languageCode')
    .optional()
    .isString()
    .isLength({ min: 2, max: 10 })
    .withMessage('Language code must be 2-10 characters'),
];
