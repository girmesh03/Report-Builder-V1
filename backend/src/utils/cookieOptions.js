/**
 * httpOnly cookie configuration for JWT tokens.
 *
 * maxAge values should match env.JWT_ACCESS_EXPIRES_IN (default 15m)
 * and env.JWT_REFRESH_EXPIRES_IN (default 7d) respectively.
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
  maxAge: 15 * ONE_MINUTE,          // sync with env.JWT_ACCESS_EXPIRES_IN
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
  maxAge: 7 * ONE_DAY,              // sync with env.JWT_REFRESH_EXPIRES_IN
});
