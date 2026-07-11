/**
 * express-validator rules for auth endpoints.
 *
 * @module validators/auth
 */
import { body } from 'express-validator';
import constants from '../utils/constants.js';

const NAME_RANGE = { min: constants.AUTH.NAME_MIN_LENGTH, max: constants.AUTH.NAME_MAX_LENGTH };
const PASSWORD_RANGE = { min: constants.AUTH.PASSWORD_MIN_LENGTH, max: constants.AUTH.PASSWORD_MAX_LENGTH };

/**
 * Validation rules for POST /api/v1/auth/register.
 *
 * @type {import('express-validator').ValidationChain[]}
 */
export const registerRules = [
  body('name')
    .trim()
    .isLength(NAME_RANGE)
    .withMessage(`Name must be ${NAME_RANGE.min}-${NAME_RANGE.max} characters`),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password')
    .isLength(PASSWORD_RANGE)
    .withMessage(`Password must be ${PASSWORD_RANGE.min}-${PASSWORD_RANGE.max} characters`),
];

/**
 * Validation rules for POST /api/v1/auth/login.
 *
 * @type {import('express-validator').ValidationChain[]}
 */
export const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];
