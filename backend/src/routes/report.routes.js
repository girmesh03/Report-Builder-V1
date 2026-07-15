/**
 * Report route definitions.
 *
 * @module routes/report
 */
import { Router } from 'express';
import { param } from 'express-validator';
import { getReports, getReport, createReport, updateReport, deleteReport, getMonthlyReport, exportReportsByDate, archiveReport, recoverReport, permanentDeleteReport } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { createReportRules, updateReportRules, archiveReportRules, recoverReportRules, permanentDeleteReportRules } from '../validators/report.validators.js';
import validate from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getReports);
router.get('/monthly', getMonthlyReport);
router.get('/export', exportReportsByDate);
router.patch('/:id/archive', archiveReportRules, validate, archiveReport);
router.post('/:id/recover', recoverReportRules, validate, recoverReport);
router.delete('/:id/permanent', permanentDeleteReportRules, validate, permanentDeleteReport);
router.get('/:id', getReport);
router.post('/', createReportRules, validate, createReport);
router.patch('/:id', updateReportRules, validate, updateReport);
router.delete('/:id', param('id').isMongoId(), validate, deleteReport);

export default router;
