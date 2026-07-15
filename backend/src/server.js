/**
 * Entry point.
 *
 * Starts the HTTP server and connects to MongoDB. Handles graceful shutdown.
 *
 * @module server
 */
import app from './app.js';
import mongoose from 'mongoose';
import env from './config/env.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import { runCleanup } from './jobs/cleanupArchivedReports.js';

let server;

connectDB()
  .then(() => {
    server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    runCleanup();
    setInterval(() => {
      logger.info('Running archived report cleanup job');
      runCleanup();
    }, 24 * 60 * 60 * 1000);
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', { error: err.message });
    process.exit(1);
  });

/**
 * Gracefully close HTTP server and MongoDB connection.
 *
 * @param {string} signal - Process signal name (e.g. 'SIGINT', 'SIGTERM')
 */
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    logger.info('HTTP server closed');
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
    process.exit(0);
  });
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
