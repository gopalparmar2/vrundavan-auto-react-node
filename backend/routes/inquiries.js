import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllInquiries, getInquiryById, createInquiry,
  updateInquiry, updateInquiryStatus, deleteInquiry
} from '../controllers/inquiryController.js';

const router = express.Router();

router.get('/', protect, getAllInquiries);
router.get('/:id', protect, getInquiryById);
router.post('/', protect, createInquiry);
router.put('/:id', protect, updateInquiry);
router.patch('/:id/status', protect, updateInquiryStatus);
router.delete('/:id', protect, deleteInquiry);

export default router;
