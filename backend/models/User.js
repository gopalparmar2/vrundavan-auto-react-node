import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'sales' },
  theme: { type: String, enum: ['dark', 'light'], default: 'dark' }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
