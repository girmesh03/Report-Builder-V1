/**
 * express-validator rules for profile endpoints.
 *
 * @module validators/profile
 */
import { body } from 'express-validator';
import constants from '../utils/constants.js';

const NAME_RANGE = { min: constants.AUTH.NAME_MIN_LENGTH, max: constants.AUTH.NAME_MAX_LENGTH };
const PASSWORD_RANGE = { min: constants.AUTH.PASSWORD_MIN_LENGTH, max: constants.AUTH.PASSWORD_MAX_LENGTH };

/**
 * Validation rules for PATCH /api/v1/profile.
 */
export const updateProfileRules = [
  body('name')
    .optional()
    .trim()
    .isLength(NAME_RANGE)
    .withMessage(`Name must be ${NAME_RANGE.min}-${NAME_RANGE.max} characters`),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: constants.PHONE_MAX_LENGTH })
    .withMessage(`Phone must not exceed ${constants.PHONE_MAX_LENGTH} characters`),
  body('avatarUrl')
    .optional()
    .trim(),
];

/**
 * Validation rules for PATCH /api/v1/profile/password.
 */
export const changePasswordRules = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength(PASSWORD_RANGE)
    .withMessage(`New password must be ${PASSWORD_RANGE.min}-${PASSWORD_RANGE.max} characters`),
];
