/**
 * Report generation validation rules.
 *
 * @module validators/reportGeneration
 */
import { body } from 'express-validator';

/** @type {import('express-validator').ValidationChain[]} */
export const saveReviewedTranscriptionRules = [
  body('reviewedTranscription')
    .trim()
    .notEmpty()
    .withMessage('Reviewed transcription is required'),
];
