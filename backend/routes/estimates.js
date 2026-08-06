import express from 'express';
import { protect } from '../middleware/auth.js';
import { createEstimate, downloadEstimatePdf } from '../controllers/estimateController.js';
import { validateCreateEstimate } from '../validations/estimateValidation.js';

const router = express.Router();

router.post('/', protect, validateCreateEstimate, createEstimate);
router.get('/:id/download', protect, downloadEstimatePdf);

export default router;
