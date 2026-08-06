import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllInquiries, getInquiryById, createInquiry,
  updateInquiry, updateInquiryStatus, deleteInquiry
} from '../controllers/inquiryController.js';
import {
  validateCreateInquiry,
  validateUpdateInquiry,
  validateUpdateStatus
} from '../validations/inquiryValidation.js';

const router = express.Router();

router.get('/', protect, getAllInquiries);
router.get('/:id', protect, getInquiryById);
router.post('/', protect, validateCreateInquiry, createInquiry);
router.put('/:id', protect, validateUpdateInquiry, updateInquiry);
router.patch('/:id/status', protect, validateUpdateStatus, updateInquiryStatus);
router.delete('/:id', protect, deleteInquiry);

export default router;
