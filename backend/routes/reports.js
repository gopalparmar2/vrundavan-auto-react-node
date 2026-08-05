import express from 'express';
import { protect } from '../middleware/auth.js';
import { getReports, exportCsv, exportPdf } from '../controllers/reportController.js';

const router = express.Router();

router.get('/', protect, getReports);
router.get('/export/csv', protect, exportCsv);
router.get('/export/pdf', protect, exportPdf);

export default router;
