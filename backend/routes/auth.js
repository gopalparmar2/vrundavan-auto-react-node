import express from 'express';
import { protect } from '../middleware/auth.js';
import { register, login, getMe, updateProfile, changePassword, updateTheme } from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateUpdateTheme
} from '../validations/authValidation.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.patch('/profile', protect, validateUpdateProfile, updateProfile);
router.patch('/change-password', protect, validateChangePassword, changePassword);
router.patch('/theme', protect, validateUpdateTheme, updateTheme);

export default router;
