/**
 * Report route definitions.
 *
 * @module routes/report
 */
import { Router } from 'express';
import { getReports, getReport, createReport, updateReport, deleteReport, getMonthlyReport, exportReportsByDate } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { createReportRules, updateReportRules } from '../validators/report.validators.js';
import validate from '../middleware/validate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getReports);
router.get('/monthly', getMonthlyReport);
router.get('/export', exportReportsByDate);
router.get('/:id', getReport);
router.post('/', createReportRules, validate, createReport);
router.patch('/:id', updateReportRules, validate, updateReport);
router.delete('/:id', deleteReport);

export default router;
