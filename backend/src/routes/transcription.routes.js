/**
 * Transcription route definitions.
 *
 * @module routes/transcription
 */
import { Router } from 'express';
import { requestTranscription, reviewByAI, reReviewByAI, deleteTranscription } from '../controllers/transcription.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requestTranscriptionRules, reviewByAIRules, reReviewByAIRules } from '../validators/transcription.validators.js';
import validate from '../middleware/validate.middleware.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post(
  '/',
  requestTranscriptionRules,
  validate,
  requestTranscription,
);

router.post(
  '/review-by-ai',
  reviewByAIRules,
  validate,
  reviewByAI,
);

router.post(
  '/re-review',
  reReviewByAIRules,
  validate,
  reReviewByAI,
);

router.delete(
  '/',
  deleteTranscription,
);

export default router;
