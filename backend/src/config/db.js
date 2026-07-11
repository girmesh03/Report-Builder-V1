/**
 * Mongoose connection setup.
 *
 * @module config/db
 */
import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';
import seedBranches from './seedBranches.js';

/**
 * Connects to MongoDB and handles connection events.
 * Auto-seeds predefined branches on first run.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    await seedBranches();
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB runtime error', { error: err.message });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
};

export default connectDB;
