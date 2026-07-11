/**
 * Audio route definitions.
 *
 * @module routes/audio
 */
import { Router } from 'express';
import { uploadAudio } from '../controllers/audio.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import uploadAudioMiddleware from '../middleware/upload.middleware.js';
import { uploadAudioRules } from '../validators/audio.validators.js';
import validate from '../middleware/validate.middleware.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post(
  '/',
  uploadAudioMiddleware.single('audio'),
  uploadAudioRules,
  validate,
  uploadAudio,
);

export default router;
