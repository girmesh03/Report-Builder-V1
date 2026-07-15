/**
 * Report preview validation rules.
 *
 * @module validators/reportPreview
 */
import { body } from 'express-validator';

/** @type {import('express-validator').ValidationChain[]} */
export const saveEditedReportRules = [
  body('editedReport')
    .trim()
    .notEmpty()
    .withMessage('Edited report content is required'),
];
