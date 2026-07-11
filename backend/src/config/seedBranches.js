/**
 * Auto-seed predefined branches on first startup.
 *
 * If the branches collection is empty, the 14 predefined Amharic
 * branches are inserted so the frontend branch select always works
 * without requiring a manual `node mock/index.js --inject`.
 *
 * Idempotent — safe to call on every startup. Uses a session for
 * the batch insert.
 *
 * @module config/seedBranches
 */
import mongoose from 'mongoose';
import Branch from '../models/branch.model.js';
import logger from '../utils/logger.js';

const PREDEFINED_BRANCHES = Object.freeze([
  { name: 'ብስራተ ገብርኤል', code: 'BGT' },
  { name: 'ቡልቡላ', code: 'BLB' },
  { name: 'መስቀል ፍላወር', code: 'MSF' },
  { name: 'ጎላጎል', code: 'GLG' },
  { name: 'ጀሞ ሚካኤል', code: 'JMK' },
  { name: 'ሳር ቤት', code: 'SRB' },
  { name: 'ቤተል', code: 'BTL' },
  { name: '4 ኪሎ', code: '4KL' },
  { name: 'ሰሚት', code: 'SMT' },
  { name: 'ኤርፖርት', code: 'APT' },
  { name: 'ሲኤምሲ', code: 'CMC' },
  { name: 'ቱሉ ዲምቱ', code: 'TLD' },
  { name: 'ወዳጅነት ፓርክ', code: 'WDP' },
  { name: 'መድኃኔዓለም', code: 'MDN' },
]);

/**
 * Seed branches if the collection is empty.
 *
 * @returns {Promise<void>}
 */
export default async function seedBranches() {
  const existingCount = await Branch.countDocuments();
  if (existingCount > 0) {
    logger.info(`Seeding skipped — ${existingCount} branches already exist`);
    return;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    await Branch.create(PREDEFINED_BRANCHES, { session, ordered: true });

    await session.commitTransaction();
    logger.info(`Seeded ${PREDEFINED_BRANCHES.length} predefined branches`);
  } catch (error) {
    await session.abortTransaction();
    logger.error('Branch seeding failed', { error: error.message });
  } finally {
    session.endSession();
  }
}
