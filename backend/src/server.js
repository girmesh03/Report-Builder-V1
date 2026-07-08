/**
 * Entry point.
 *
 * Starts the HTTP server and connects to MongoDB. Handles graceful shutdown.
 *
 * @module server
 */
import app from './app.js';
import env from './config/env.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  connectDB();
});

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
