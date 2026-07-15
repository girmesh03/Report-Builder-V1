/**
 * Report preview route definitions.
 *
 * @module routes/reportPreview
 */
import { Router } from 'express';
import {
  getReportPreview,
  saveEditedReport,
  finalizeReport,
} from '../controllers/reportPreview.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { saveEditedReportRules } from '../validators/reportPreview.validators.js';
import validate from '../middleware/validate.middleware.js';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get(
  '/preview',
  getReportPreview,
);

router.patch(
  '/generated-report',
  saveEditedReportRules,
  validate,
  saveEditedReport,
);

router.post(
  '/finalize',
  finalizeReport,
);

export default router;
