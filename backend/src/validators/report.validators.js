/**
 * express-validator rules for report endpoints.
 *
 * @module validators/report
 */
import { body, param } from 'express-validator';
import constants from '../utils/constants.js';

/**
 * Validation rules for POST /api/v1/reports.
 *
 * @type {import('express-validator').ValidationChain[]}
 */
export const createReportRules = [
  body('reportDate')
    .notEmpty()
    .withMessage('Report date is required')
    .isISO8601()
    .withMessage('Report date must be a valid date'),
  body('branches')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one branch is required'),
  body('branches.*')
    .optional()
    .isMongoId()
    .withMessage('Each branch must be a valid ID'),
];

/**
 * Validation rules for PATCH /api/v1/reports/:id.
 *
 * @type {import('express-validator').ValidationChain[]}
 */
export const updateReportRules = [
  body('reportDate')
    .optional()
    .isISO8601()
    .withMessage('Report date must be a valid date'),
  body('branches')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one branch is required'),
  body('branches.*')
    .optional()
    .isMongoId()
    .withMessage('Each branch must be a valid ID'),
  body('status')
    .optional()
    .isIn(Object.values(constants.REPORT_STATUS))
    .withMessage(`Status must be one of: ${Object.values(constants.REPORT_STATUS).join(', ')}`),
  body('notes')
    .optional()
    .trim(),
  body('reviewedTranscription')
    .optional()
    .trim(),
  body('editedReport')
    .optional()
    .trim(),
];

/**
 * Validation rules for PATCH /api/v1/reports/:id/archive.
 *
 * @type {import('express-validator').ValidationChain[]}
 */
export const archiveReportRules = [
  param('id').isMongoId().withMessage('Invalid report ID'),
];

/**
 * Validation rules for POST /api/v1/reports/:id/recover.
 *
 * @type {import('express-validator').ValidationChain[]}
 */
export const recoverReportRules = [
  param('id').isMongoId().withMessage('Invalid report ID'),
];

/**
 * Validation rules for DELETE /api/v1/reports/:id/permanent.
 *
 * @type {import('express-validator').ValidationChain[]}
 */
export const permanentDeleteReportRules = [
  param('id').isMongoId().withMessage('Invalid report ID'),
];
