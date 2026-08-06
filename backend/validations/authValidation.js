import { sendError } from '../utils/responseHelper.js';

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Full name is required');
  }
  if (!email || typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email)) {
    errors.push('A valid email address is required');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('Email address is required');
  }
  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};

export const validateUpdateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    errors.push('Name cannot be empty');
  }
  if (email !== undefined && (typeof email !== 'string' || !/\S+@\S+\.\S+/.test(email))) {
    errors.push('Valid email address is required');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};

export const validateChangePassword = (req, res, next) => {
  const { current_password, new_password } = req.body;
  const errors = [];

  if (!current_password) {
    errors.push('Current password is required');
  }
  if (!new_password || new_password.length < 6) {
    errors.push('New password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};

export const validateUpdateTheme = (req, res, next) => {
  const { theme } = req.body;
  if (!theme || !['dark', 'light'].includes(theme)) {
    return sendError(res, 'Theme must be either "dark" or "light"', 400);
  }
  next();
};
