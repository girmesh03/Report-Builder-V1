/**
 * Mongoose connection setup.
 *
 * @module config/db
 */
import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';
import seedBranches from './seedBranches.js';

const RECONNECT_INTERVAL_MS = 5000;

/**
 * Connects to MongoDB with unlimited retries until successful.
 * Auto-seeds predefined branches on first run.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI);
      logger.info(`MongoDB connected: ${conn.connection.host}`);
      await seedBranches();
      break;
    } catch (error) {
      logger.error('MongoDB connection failed — retrying in 5s', { error: error.message });
      await new Promise((resolve) => setTimeout(resolve, RECONNECT_INTERVAL_MS));
    }
  }

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB runtime error', { error: err.message });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
};

export default connectDB;
