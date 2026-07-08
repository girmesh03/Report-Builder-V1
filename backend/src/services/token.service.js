/**
 * JWT access and refresh token generation and verification.
 *
 * @module services/token
 */
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Generate an access token (short-lived).
 *
 * @param {object} payload - Token payload (typically { userId, role })
 * @returns {string} Signed JWT
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
};

/**
 * Generate a refresh token (long-lived).
 *
 * @param {object} payload - Token payload (typically { userId })
 * @returns {string} Signed JWT
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
};

/**
 * Verify and decode an access token.
 *
 * @param {string} token - Access JWT
 * @returns {{ userId: string, role: string, iat: number, exp: number }}
 * @throws {jwt.JsonWebTokenError|jwt.TokenExpiredError}
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
};

/**
 * Verify and decode a refresh token.
 *
 * @param {string} token - Refresh JWT
 * @returns {{ userId: string, iat: number, exp: number }}
 * @throws {jwt.JsonWebTokenError|jwt.TokenExpiredError}
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
