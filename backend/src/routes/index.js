/**
 * Route aggregator.
 *
 * Mounts all route modules under their prefixes.
 *
 * @module routes/index
 */
import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import branchRoutes from './branch.routes.js';
import reportRoutes from './report.routes.js';
import audioRoutes from './audio.routes.js';
import transcriptionRoutes from './transcription.routes.js';
import reportGenerationRoutes from './reportGeneration.routes.js';
import reportPreviewRoutes from './reportPreview.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/branches', branchRoutes);
router.use('/reports', reportRoutes);
router.use('/reports/:reportId/audio', audioRoutes);
router.use('/reports/:reportId/transcriptions', transcriptionRoutes);
router.use('/reports/:reportId', reportGenerationRoutes);
router.use('/reports/:reportId', reportPreviewRoutes);

export default router;
