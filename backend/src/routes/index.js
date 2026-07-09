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

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/branches', branchRoutes);
router.use('/reports', reportRoutes);

export default router;
