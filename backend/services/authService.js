const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async register(userData) {
    const { name, email, password, role, phone } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { statusCode: 400, message: 'Email already registered' };
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password_hash,
      role: role || 'sales_executive',
      phone: phone || ''
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey_vehicle_dealership',
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw { statusCode: 400, message: 'Invalid credentials' };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw { statusCode: 400, message: 'Invalid credentials' };
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey_vehicle_dealership',
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    };
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-password_hash');
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const { name, phone } = updateData;
    const user = await User.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      throw { statusCode: 400, message: 'Current password is incorrect' };
    }

    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return { message: 'Password updated successfully' };
  }
}

module.exports = new AuthService();
