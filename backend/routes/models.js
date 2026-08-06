import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAllModels, getModelById, createModel, updateModel, deleteModel } from '../controllers/modelController.js';
import { validateCreateModel, validateUpdateModel } from '../validations/modelValidation.js';

const router = express.Router();

router.get('/', protect, getAllModels);
router.get('/:id', protect, getModelById);
router.post('/', protect, validateCreateModel, createModel);
router.put('/:id', protect, validateUpdateModel, updateModel);
router.delete('/:id', protect, deleteModel);

export default router;
