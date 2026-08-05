import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: '' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  model: { type: mongoose.Schema.Types.ObjectId, ref: 'VehicleModel', required: true },
  source: { type: String, required: true, default: 'walk-in' }, // walk-in, phone, online
  status: { 
    type: String, 
    required: true, 
    enum: ['New', 'Contacted', 'Estimate Sent', 'Negotiation', 'Converted', 'Lost'],
    default: 'New'
  },
  notes: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model('Inquiry', inquirySchema);
