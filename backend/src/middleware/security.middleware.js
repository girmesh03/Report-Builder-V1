/**
 * Security middleware stack.
 *
 * Applies helmet, cors, compression, cookie-parser, mongo-sanitize, and rate-limit.
 *
 * @module middleware/security
 */
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import env from '../config/env.js';
import constants from '../utils/constants.js';

/** @type {import('express-rate-limit').RateLimitRequestHandler} */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

/** @type {import('express-rate-limit').RateLimitRequestHandler} */
const authLimiter = rateLimit({
  windowMs: constants.AUTH_RATE_LIMIT.WINDOW_MS,
  max: constants.AUTH_RATE_LIMIT.MAX,
  message: constants.AUTH_RATE_LIMIT.MESSAGE,
});

/**
 * Applies all security middleware to the Express app.
 *
 * @param {import('express').Application} app - Express application
 * @returns {void}
 */
const applySecurityMiddleware = (app) => {
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(compression());
  app.use(cookieParser());
  app.use(mongoSanitize());
  app.use(generalLimiter);
};

export { applySecurityMiddleware, authLimiter };
