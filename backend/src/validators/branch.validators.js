/**
 * express-validator rules for branch endpoints.
 *
 * @module validators/branch
 */
import { body } from 'express-validator';
import constants from '../utils/constants.js';

const CODE_RANGE = { min: constants.BRANCH.CODE_MIN_LENGTH, max: constants.BRANCH.CODE_MAX_LENGTH };

/**
 * Validation rules for POST /api/v1/branches.
 */
export const createBranchRules = [
  body('name')
    .trim()
    .isIn(constants.BRANCH_NAMES)
    .withMessage(`Branch name must be one of: ${constants.BRANCH_NAMES.join(', ')}`),
  body('code')
    .trim()
    .isLength(CODE_RANGE)
    .withMessage(`Branch code must be ${CODE_RANGE.min}-${CODE_RANGE.max} characters`),
  body('branch')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  body('managerName')
    .optional()
    .trim(),
  body('managerPhone')
    .optional()
    .trim()
    .isLength({ max: constants.PHONE_MAX_LENGTH })
    .withMessage(`Phone must not exceed ${constants.PHONE_MAX_LENGTH} characters`),
];

/**
 * Validation rules for PATCH /api/v1/branches/:id.
 */
export const updateBranchRules = [
  body('name')
    .optional()
    .trim()
    .isIn(constants.BRANCH_NAMES)
    .withMessage(`Branch name must be one of: ${constants.BRANCH_NAMES.join(', ')}`),
  body('code')
    .optional()
    .trim()
    .isLength(CODE_RANGE)
    .withMessage(`Branch code must be ${CODE_RANGE.min}-${CODE_RANGE.max} characters`),
  body('branch')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  body('managerName')
    .optional()
    .trim(),
  body('managerPhone')
    .optional()
    .trim()
    .isLength({ max: constants.PHONE_MAX_LENGTH })
    .withMessage(`Phone must not exceed ${constants.PHONE_MAX_LENGTH} characters`),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];
