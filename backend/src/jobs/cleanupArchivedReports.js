/**
 * Archived report cleanup job.
 *
 * Finds reports whose archiveAt deadline has passed and permanently
 * deletes them (audio files + DB document).
 *
 * @module jobs/cleanupArchivedReports
 */
import mongoose from 'mongoose';
import Report from '../models/report.model.js';
import * as audioService from '../services/audio.service.js';
import logger from '../utils/logger.js';

/**
 * Run cleanup of expired archived reports.
 *
 * @returns {Promise<number>} Number of reports cleaned up
 */
export const runCleanup = async () => {
  const session = await mongoose.startSession();
  let cleaned = 0;
  try {
    session.startTransaction();

    const expiredReports = await Report.find({
      archiveAt: { $lte: new Date() },
      isDeleted: false,
    }).session(session);

    for (const report of expiredReports) {
      await audioService.deleteAllAudioFiles(report);
      await report.deleteOne({ session });
      cleaned++;
      logger.info(`Cleaned up expired archived report ${report._id}`);
    }

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    logger.error('Cleanup job failed', { error: error.message });
  } finally {
    session.endSession();
  }

  if (cleaned > 0) {
    logger.info(`Cleanup job completed: ${cleaned} report(s) removed`);
  }
  return cleaned;
};
