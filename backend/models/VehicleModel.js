import mongoose from 'mongoose';

const vehicleModelSchema = new mongoose.Schema({
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  name: { type: String, required: true },
  variant: { type: String, required: true },
  on_road_price: { type: Number, required: true },
  ex_showroom_price: { type: Number, default: 0 },
  fuel_type: { type: String, required: true, enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] },
  transmission: { type: String, required: true, enum: ['Manual', 'Automatic'] },
  image: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.model('VehicleModel', vehicleModelSchema);
