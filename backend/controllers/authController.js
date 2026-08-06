import authService from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const register = async (req, res) => {
  try {
    const userData = await authService.register(req.body);
    return sendSuccess(res, userData, 'Registration successful', 201);
  } catch (error) {
    return sendError(res, error.message || 'Registration failed', error.statusCode || 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await authService.login(email, password);
    return sendSuccess(res, userData, 'Login successful');
  } catch (error) {
    return sendError(res, error.message || 'Login failed', error.statusCode || 500);
  }
};

export const getMe = async (req, res) => {
  try {
    const profile = await authService.getUserProfile(req.user._id);
    return sendSuccess(res, profile, 'User profile retrieved');
  } catch (error) {
    return sendError(res, error.message || 'Failed to fetch user profile', error.statusCode || 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateProfile(req.user._id, req.body);
    return sendSuccess(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    return sendError(res, error.message || 'Failed to update profile', error.statusCode || 500);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const result = await authService.changePassword(req.user._id, current_password, new_password);
    return sendSuccess(res, null, result.message);
  } catch (error) {
    return sendError(res, error.message || 'Failed to change password', error.statusCode || 500);
  }
};

export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const result = await authService.updateTheme(req.user._id, theme);
    return sendSuccess(res, result, 'Theme updated successfully');
  } catch (error) {
    return sendError(res, error.message || 'Failed to update theme', error.statusCode || 500);
  }
};
