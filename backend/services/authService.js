import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {
  generateToken(id) {
    return jwt.sign(
      { id },
      process.env.JWT_SECRET || 'vehicle_dealership_jwt_secret_key_2026',
      { expiresIn: '30d' }
    );
  }

  async register({ name, email, password, role }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw { statusCode: 400, message: 'User with this email already exists' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'sales'
    });

    const token = this.generateToken(user._id);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      theme: user.theme,
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const token = this.generateToken(user._id);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      theme: user.theme,
      token
    };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw { statusCode: 404, message: 'User profile not found' };
    }
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      theme: user.theme
    };
  }

  async updateProfile(userId, { name, email }) {
    const user = await User.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();

    const updated = await user.save();
    return {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      theme: updated.theme
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw { statusCode: 400, message: 'Current password is incorrect' };
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async updateTheme(userId, theme) {
    if (!['dark', 'light'].includes(theme)) {
      throw { statusCode: 400, message: 'Invalid theme value' };
    }
    const user = await User.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    user.theme = theme;
    await user.save();

    return { theme: user.theme };
  }
}

export default new AuthService();
