import express from 'express';
import { protect } from '../middleware/auth.js';
import { createEstimate, downloadEstimatePdf } from '../controllers/estimateController.js';

const router = express.Router();

router.post('/', protect, createEstimate);
router.get('/:id/download', protect, downloadEstimatePdf);

export default router;
