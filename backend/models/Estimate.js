import mongoose from 'mongoose';

const estimateSchema = new mongoose.Schema({
  inquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', required: true },
  on_road_price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  accessories_cost: { type: Number, default: 0 },
  insurance: { type: Number, default: 0 },
  rto_charges: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
  pdf_path: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.model('Estimate', estimateSchema);
