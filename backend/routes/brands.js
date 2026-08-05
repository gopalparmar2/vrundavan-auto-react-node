import express from 'express';
import { protect } from '../middleware/auth.js';
import { getAllBrands, getBrandById, getModelsByBrand, createBrand, updateBrand, deleteBrand } from '../controllers/brandController.js';

const router = express.Router();

router.get('/', protect, getAllBrands);
router.get('/:id', protect, getBrandById);
router.get('/:id/models', protect, getModelsByBrand);
router.post('/', protect, createBrand);
router.put('/:id', protect, updateBrand);
router.delete('/:id', protect, deleteBrand);

export default router;
