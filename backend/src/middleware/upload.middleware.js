/**
 * Multer upload middleware for audio files.
 *
 * Stores uploaded audio temporarily under backend/uploads/audio/
 * with a unique filename. Validates MIME type and file size.
 *
 * @module middleware/upload
 */
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { isAllowedAudioMime, MAX_AUDIO_SIZE } from '../utils/fileValidation.js';
import ApiError from '../utils/apiError.js';
import httpStatus from '../utils/httpStatus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads/audio');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.webm';
    const unique = crypto.randomUUID();
    cb(null, `audio-${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (isAllowedAudioMime(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, `Unsupported audio format: ${file.mimetype}`), false);
  }
};

const uploadAudio = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_AUDIO_SIZE },
});

export default uploadAudio;
