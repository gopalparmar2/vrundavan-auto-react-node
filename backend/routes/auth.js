import express from 'express';
import { protect } from '../middleware/auth.js';
import { register, login, getMe, updateProfile, changePassword, updateTheme } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);
router.patch('/theme', protect, updateTheme);

export default router;
