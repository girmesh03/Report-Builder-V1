/**
 * Structured logging utility.
 *
 * @module utils/logger
 */

const LOG_LEVELS = Object.freeze({
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
});

const isDev = process.env.NODE_ENV === 'development';

/**
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} [meta] - Optional metadata
 */
const log = (level, message, meta) => {
  const entry = { timestamp: new Date().toISOString(), level, message };
  if (meta) {
    entry.meta = meta;
  }
  if (isDev) {
    console[level](JSON.stringify(entry, null, 2));
  } else {
    console[level](JSON.stringify(entry));
  }
};

const logger = Object.freeze({
  error: (message, meta) => log(LOG_LEVELS.ERROR, message, meta),
  warn: (message, meta) => log(LOG_LEVELS.WARN, message, meta),
  info: (message, meta) => log(LOG_LEVELS.INFO, message, meta),
  debug: (message, meta) => log(LOG_LEVELS.DEBUG, message, meta),
});

export default logger;
