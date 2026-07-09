/**
 * Mock data injector / DB wiper.
 *
 * Usage:
 *   node backend/mock/index.js --inject   Seed development data
 *   node backend/mock/index.js --wipe     Drop all collections
 *
 * Both operations run within a MongoDB session for transactional safety.
 * Only available in development mode.
 *
 * @module mock/index
 */
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { users as userData, branches as branchData, reports as reportData } from './data.js';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/report-builder-v1';
const NODE_ENV = process.env.NODE_ENV || 'development';

const args = process.argv.slice(2);
const isInject = args.includes('--inject');
const isWipe = args.includes('--wipe');

if (!isInject && !isWipe) {
  console.error('Usage: node backend/mock/index.js [--inject | --wipe]');
  process.exit(1);
}

if (NODE_ENV !== 'development') {
  console.error(`Mock script can only run in development mode (current: ${NODE_ENV})`);
  process.exit(1);
}

/**
 * Seed development data.
 *
 * @param {import('mongoose').ClientSession} session
 */
const inject = async (session) => {
  const { default: User } = await import('../src/models/user.model.js');
  const { default: Branch } = await import('../src/models/branch.model.js');
  const { default: Report } = await import('../src/models/report.model.js');

  // --- Users ---
  const createdUsers = [];
  for (const uData of userData) {
    const existing = await User.findOne({ email: uData.email }).session(session);
    if (existing) {
      console.log(`  - User ${uData.email} already exists, skipping`);
      createdUsers.push(existing);
      continue;
    }
    // Pass plain password — the model's pre('save') hook hashes it via bcryptjs
    const [user] = await User.create(
      [{ ...uData }],
      { session },
    );
    createdUsers.push(user);
    console.log(`  ✓ Created user: ${uData.name} (${uData.email})`);
  }

  // --- Branches ---
  const createdBranches = [];
  for (const bData of branchData) {
    const existing = await Branch.findOne({ code: bData.code }).session(session);
    if (existing) {
      console.log(`  - Branch ${bData.code} already exists, skipping`);
      createdBranches.push(existing);
      continue;
    }
    const [branch] = await Branch.create([bData], { session });
    createdBranches.push(branch);
    console.log(`  ✓ Created branch: ${bData.name} (${bData.code})`);
  }

  // --- Reports ---
  const existingReportCount = await Report.countDocuments().session(session);
  if (existingReportCount > 0) {
    await Report.deleteMany({}).session(session);
    console.log(`  - Removed ${existingReportCount} existing report(s) for re-seed`);
  }

  const reportsToCreate = [];
  for (const rData of reportData) {
    const user = createdUsers[rData.userIdx];
    if (!user) {
      console.log(`  ! WARNING: No user found at index ${rData.userIdx}, skipping report`);
      continue;
    }
    const branchDocs = rData.branchIdxs
      .map((idx) => createdBranches[idx])
      .filter(Boolean);
    if (branchDocs.length === 0) {
      console.log(`  ! WARNING: No branches resolved for report, skipping`);
      continue;
    }
    reportsToCreate.push({
      user: user._id,
      reportDate: rData.reportDate,
      branches: branchDocs.map((b) => b._id),
      status: rData.status,
      supervisorName: rData.supervisorName,
      languageMode: rData.languageMode || 'am',
      notes: rData.notes,
      audioClips: rData.audioClips,
      transcription: rData.transcription,
      reviewedTranscription: rData.reviewedTranscription || '',
      generatedReport: rData.generatedReport,
      editedReport: rData.editedReport || '',
      exportHistory: rData.exportHistory,
    });
  }

  if (reportsToCreate.length > 0) {
    await Report.create(reportsToCreate, { session, ordered: true });
  }
  console.log(`  ✓ Created ${reportsToCreate.length} report(s)`);

  console.log('\nInjection complete.');
};

/**
 * Drop all application collections.
 *
 * Runs directly on the database (DDL operations are not supported
 * inside MongoDB multi-document transactions on Atlas/replica sets).
 */
const wipe = async () => {
  const collections = ['users', 'branches', 'reports', 'oauthaccounts', 'aigenerations'];
  const db = mongoose.connection.db;

  for (const name of collections) {
    const collectionsList = await db.listCollections({ name }).toArray();
    if (collectionsList.length > 0) {
      await db.collection(name).drop();
      console.log(`  ✗ Dropped collection: ${name}`);
    } else {
      console.log(`  - Collection ${name} does not exist, skipping`);
    }
  }

  console.log('\nWipe complete.');
};

const run = async () => {
  console.log(`\nMode: ${isInject ? 'INJECT' : 'WIPE'}`);
  console.log(`Database: ${MONGODB_URI}\n`);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    if (isWipe) {
      await wipe();
      return;
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      if (isInject) {
        await inject(session);
      }

      await session.commitTransaction();
      console.log('Transaction committed successfully.');
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction aborted:', error.message);
      process.exit(1);
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

run();
