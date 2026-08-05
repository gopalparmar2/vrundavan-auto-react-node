import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAllModels, getModelById, createModel, updateModel, deleteModel } from '../controllers/modelController.js';

const router = express.Router();

router.get('/', protect, getAllModels);
router.get('/:id', protect, getModelById);
router.post('/', protect, createModel);
router.put('/:id', protect, updateModel);
router.delete('/:id', protect, deleteModel);

export default router;
