/**
 * Transcription route definitions.
 *
 * @module routes/transcription
 */
import { Router } from 'express';
import { requestTranscription } from '../controllers/transcription.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requestTranscriptionRules } from '../validators/transcription.validators.js';
import validate from '../middleware/validate.middleware.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post(
  '/',
  requestTranscriptionRules,
  validate,
  requestTranscription,
);

export default router;
