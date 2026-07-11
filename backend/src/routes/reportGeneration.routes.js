/**
 * Report generation route definitions.
 *
 * @module routes/reportGeneration
 */
import { Router } from 'express';
import {
  saveReviewedTranscription,
  generateReport,
} from '../controllers/reportGeneration.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { saveReviewedTranscriptionRules } from '../validators/reportGeneration.validators.js';
import validate from '../middleware/validate.middleware.js';

const router = Router({ mergeParams: true });

router.patch(
  '/transcriptions/review',
  authenticate,
  saveReviewedTranscriptionRules,
  validate,
  saveReviewedTranscription,
);

router.post(
  '/generate',
  authenticate,
  generateReport,
);

export default router;
