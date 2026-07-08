/**
 * httpOnly cookie configuration for JWT tokens.
 *
 * @module utils/cookieOptions
 */
import env from '../config/env.js';

const ONE_MINUTE = 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Access token cookie options (15m expiry, scoped to /api/v1).
 *
 * @type {import('express').CookieOptions}
 */
export const accessTokenCookieOptions = Object.freeze({
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE,
  path: '/api/v1',
  maxAge: 15 * ONE_MINUTE,
});

/**
 * Refresh token cookie options (7d expiry, scoped to /api/v1/auth).
 *
 * @type {import('express').CookieOptions}
 */
export const refreshTokenCookieOptions = Object.freeze({
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: env.COOKIE_SAME_SITE,
  path: '/api/v1/auth',
  maxAge: 7 * ONE_DAY,
});
