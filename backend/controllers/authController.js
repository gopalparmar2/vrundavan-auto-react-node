import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'vehicle_dealership_jwt_secret_key_2026', { expiresIn: '30d' });

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return sendError(res, 'Please provide all required fields', 400);
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) return sendError(res, 'User with this email already exists', 400);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashedPassword, role: role || 'sales' });
    return sendSuccess(res, {
      _id: user._id, name: user.name, email: user.email, role: user.role, theme: user.theme,
      token: generateToken(user._id)
    }, 'Registration successful', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (user && (await bcrypt.compare(password, user.password))) {
      return sendSuccess(res, {
        _id: user._id, name: user.name, email: user.email, role: user.role, theme: user.theme,
        token: generateToken(user._id)
      }, 'Login successful');
    }
    return sendError(res, 'Invalid email or password', 401);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const getMe = async (req, res) => {
  return sendSuccess(res, {
    _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, theme: req.user.theme
  }, 'User profile retrieved');
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    const updated = await user.save();
    return sendSuccess(res, {
      _id: updated._id, name: updated.name, email: updated.email, role: updated.role, theme: updated.theme
    }, 'Profile updated successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) return sendError(res, 'Current password is incorrect', 400);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    await user.save();
    return sendSuccess(res, null, 'Password updated successfully');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

export const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    if (!['dark', 'light'].includes(theme)) return sendError(res, 'Invalid theme value', 400);
    const user = await User.findById(req.user._id);
    user.theme = theme;
    await user.save();
    return sendSuccess(res, { theme: user.theme }, 'Theme updated');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
