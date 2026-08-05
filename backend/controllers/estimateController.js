import estimateService from '../services/estimateService.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const createEstimate = async (req, res) => {
  try {
    const estimate = await estimateService.createEstimate(req.body, req.user._id);
    return sendSuccess(res, estimate, 'Estimate generated successfully', 201);
  } catch (err) {
    return sendError(res, err.message || 'Failed to generate estimate', err.statusCode || 500);
  }
};

export const downloadEstimatePdf = async (req, res) => {
  try {
    await estimateService.generatePdf(req.params.id, res);
  } catch (err) {
    return sendError(res, err.message || 'Failed to generate PDF', err.statusCode || 500);
  }
};
