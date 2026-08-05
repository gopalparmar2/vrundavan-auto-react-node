import dashboardService from '../services/dashboardService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getDashboard = async (req, res) => {
  try {
    const stats = await dashboardService.getStats();
    return sendSuccess(res, stats, 'Dashboard data retrieved successfully');
  } catch (err) {
    return sendError(res, err.message || 'Failed to retrieve dashboard data', err.statusCode || 500);
  }
};
