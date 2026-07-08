/**
 * Request logger middleware.
 *
 * Uses morgan in development mode only.
 *
 * @module middleware/requestLogger
 */
import morgan from 'morgan';
import env from '../config/env.js';

/**
 * Applies morgan request logging in development.
 *
 * @param {import('express').Application} app - Express application
 * @returns {void}
 */
const applyRequestLogger = (app) => {
  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
};

export default applyRequestLogger;
