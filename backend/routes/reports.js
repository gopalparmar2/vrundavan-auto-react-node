import express from 'express';
import { protect } from '../middleware/auth.js';
import { getReports, exportCsv, exportPdf } from '../controllers/reportController.js';
import { validateReportQuery } from '../validations/reportValidation.js';

const router = express.Router();

router.get('/', protect, validateReportQuery, getReports);
router.get('/export/csv', protect, validateReportQuery, exportCsv);
router.get('/export/pdf', protect, validateReportQuery, exportPdf);

export default router;
