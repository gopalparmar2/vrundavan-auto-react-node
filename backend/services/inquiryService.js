import Inquiry from '../models/Inquiry.js';
import InquiryStatusLog from '../models/InquiryStatusLog.js';

const POPULATE_INQUIRY = [
  { path: 'brand', select: 'name logo' },
  { path: 'model', select: 'name variant on_road_price ex_showroom_price fuel_type transmission image' },
  { path: 'user', select: 'name email' }
];

class InquiryService {
  async getAllInquiries({ status, brand_id, search } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (brand_id) filter.brand = brand_id;
    if (search) {
      filter.$or = [
        { customer_name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    return await Inquiry.find(filter)
      .populate(POPULATE_INQUIRY)
      .sort({ createdAt: -1 });
  }

  async getInquiryById(id) {
    const inquiry = await Inquiry.findById(id).populate(POPULATE_INQUIRY);
    if (!inquiry) throw { statusCode: 404, message: 'Inquiry not found' };
    const statusLogs = await InquiryStatusLog.find({ inquiry: inquiry._id })
      .populate('changed_by', 'name email')
      .sort({ createdAt: 1 });
    return { inquiry, statusLogs };
  }

  async createInquiry({ customer_name, phone, email, brand_id, model_id, source, notes, status }, userId) {
    if (!customer_name || !phone || !brand_id || !model_id) {
      throw { statusCode: 400, message: 'Customer name, phone, brand, and model are required' };
    }
    const newStatus = status || 'New';
    const inquiry = await Inquiry.create({
      customer_name,
      phone,
      email: email || '',
      brand: brand_id,
      model: model_id,
      source: source || 'walk-in',
      status: newStatus,
      notes: notes || '',
      user: userId
    });
    await InquiryStatusLog.create({ inquiry: inquiry._id, old_status: null, new_status: newStatus, changed_by: userId });
    return await Inquiry.findById(inquiry._id).populate(POPULATE_INQUIRY);
  }

  async updateInquiry(id, { customer_name, phone, email, brand_id, model_id, source, notes, status }, userId) {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) throw { statusCode: 404, message: 'Inquiry not found' };
    if (customer_name) inquiry.customer_name = customer_name;
    if (phone) inquiry.phone = phone;
    if (email !== undefined) inquiry.email = email;
    if (brand_id) inquiry.brand = brand_id;
    if (model_id) inquiry.model = model_id;
    if (source) inquiry.source = source;
    if (notes !== undefined) inquiry.notes = notes;
    if (status && status !== inquiry.status) {
      const oldStatus = inquiry.status;
      inquiry.status = status;
      await InquiryStatusLog.create({ inquiry: inquiry._id, old_status: oldStatus, new_status: status, changed_by: userId });
    }
    await inquiry.save();
    return await Inquiry.findById(inquiry._id).populate(POPULATE_INQUIRY);
  }

  async updateStatus(id, status, userId) {
    if (!status) throw { statusCode: 400, message: 'New status is required' };
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) throw { statusCode: 404, message: 'Inquiry not found' };
    if (inquiry.status !== status) {
      const oldStatus = inquiry.status;
      inquiry.status = status;
      await inquiry.save();
      await InquiryStatusLog.create({ inquiry: inquiry._id, old_status: oldStatus, new_status: status, changed_by: userId });
    }
    return await Inquiry.findById(inquiry._id).populate(POPULATE_INQUIRY);
  }

  async deleteInquiry(id) {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) throw { statusCode: 404, message: 'Inquiry not found' };
    await InquiryStatusLog.deleteMany({ inquiry: inquiry._id });
    await inquiry.deleteOne();
    return { message: 'Inquiry and associated logs deleted' };
  }
}

export default new InquiryService();
