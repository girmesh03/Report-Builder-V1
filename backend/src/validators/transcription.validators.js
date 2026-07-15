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

/** @type {import('express-validator').ValidationChain[]} */
export const reviewByAIRules = [
  body('transcription')
    .isString()
    .withMessage('Transcription must be a string')
    .notEmpty()
    .withMessage('Transcription cannot be empty'),
  body('feedback')
    .optional()
    .isString()
    .withMessage('Feedback must be a string'),
];

/** @type {import('express-validator').ValidationChain[]} */
export const reReviewByAIRules = [
  body('currentTranscription')
    .isString()
    .withMessage('Current transcription must be a string')
    .notEmpty()
    .withMessage('Current transcription cannot be empty'),
  body('userFeedback')
    .isString()
    .withMessage('User feedback must be a string')
    .notEmpty()
    .withMessage('User feedback cannot be empty'),
];
