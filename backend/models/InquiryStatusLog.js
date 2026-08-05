import mongoose from 'mongoose';

const inquiryStatusLogSchema = new mongoose.Schema({
  inquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', required: true },
  old_status: { type: String, default: null },
  new_status: { type: String, required: true },
  changed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model('InquiryStatusLog', inquiryStatusLogSchema);
