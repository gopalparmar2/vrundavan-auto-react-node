import Inquiry from '../models/Inquiry.js';
import Brand from '../models/Brand.js';
import VehicleModel from '../models/VehicleModel.js';

class DashboardService {
  async getStats() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalInquiriesMonth, totalSalesMonth, pendingEstimates, activeBrandsCount, totalModelsCount, recentInquiries] = await Promise.all([
      Inquiry.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Inquiry.countDocuments({ status: 'Converted', updatedAt: { $gte: startOfMonth } }),
      Inquiry.countDocuments({ status: { $in: ['Estimate Sent', 'Negotiation'] } }),
      Brand.countDocuments({ status: 'active' }),
      VehicleModel.countDocuments(),
      Inquiry.find()
        .populate('brand', 'name logo')
        .populate('model', 'name variant')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    return {
      totalInquiriesMonth,
      totalSalesMonth,
      pendingEstimates,
      activeBrandsCount,
      totalModelsCount,
      recentInquiries
    };
  }
}

export default new DashboardService();
