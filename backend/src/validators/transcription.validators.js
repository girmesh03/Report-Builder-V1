/**
 * Transcription request validation rules.
 *
 * @module validators/transcription
 */
import { body } from 'express-validator';

/** @type {import('express-validator').ValidationChain[]} */
export const requestTranscriptionRules = [
  body('clipId')
    .optional()
    .isMongoId()
    .withMessage('Clip ID must be a valid MongoDB ID'),
];
