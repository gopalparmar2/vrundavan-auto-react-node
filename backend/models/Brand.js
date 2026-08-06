import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: {
    type: String,
    default: '',
    get: (filename) => {
      const baseUrl = (process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/+$/, '');
      const placeholderUrl = `${baseUrl}/assets/placeholder.svg`;

      if (!filename || filename.includes('placeholder')) return placeholderUrl;
      if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
      }
      const cleanFilename = filename.replace(/^\/uploads\/[^\/]+\//, '').replace(/^\/+/, '');
      const filePath = path.join(uploadsDir, 'brands', cleanFilename);

      if (!fs.existsSync(filePath)) {
        return placeholderUrl;
      }
      return `${baseUrl}/uploads/brands/${cleanFilename}`;
    },
    set: (val) => {
      if (!val || val.includes('placeholder')) return '';
      const parts = val.split('/');
      return parts[parts.length - 1];
    }
  },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

export default mongoose.model('Brand', brandSchema);
