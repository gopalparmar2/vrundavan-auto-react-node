import { sendError } from '../utils/responseHelper.js';

export const validateCreateEstimate = (req, res, next) => {
  const { inquiry_id, on_road_price } = req.body;
  const errors = [];

  if (!inquiry_id) errors.push('Inquiry ID is required');
  if (on_road_price === undefined || isNaN(Number(on_road_price)) || Number(on_road_price) <= 0) {
    errors.push('Valid on-road price is required');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};
