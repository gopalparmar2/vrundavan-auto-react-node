import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../uploads');

const vehicleModelSchema = new mongoose.Schema({
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  name: { type: String, required: true },
  variant: { type: String, required: true },
  on_road_price: { type: Number, required: true },
  ex_showroom_price: { type: Number, default: 0 },
  fuel_type: { type: String, required: true, enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] },
  transmission: { type: String, required: true, enum: ['Manual', 'Automatic'] },
  image: {
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
      const filePath = path.join(uploadsDir, 'models', cleanFilename);

      if (!fs.existsSync(filePath)) {
        return placeholderUrl;
      }
      return `${baseUrl}/uploads/models/${cleanFilename}`;
    },
    set: (val) => {
      if (!val || val.includes('placeholder')) return '';
      const parts = val.split('/');
      return parts[parts.length - 1];
    }
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

export default mongoose.model('VehicleModel', vehicleModelSchema);
