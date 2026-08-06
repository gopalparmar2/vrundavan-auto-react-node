import { sendError } from '../utils/responseHelper.js';

export const validateReportQuery = (req, res, next) => {
  const { start_date, end_date, status } = req.query;
  const errors = [];

  if (start_date && isNaN(Date.parse(start_date))) {
    errors.push('Invalid start_date format');
  }
  if (end_date && isNaN(Date.parse(end_date))) {
    errors.push('Invalid end_date format');
  }
  if (status && !['New', 'Contacted', 'Estimate Sent', 'Negotiation', 'Converted', 'Lost'].includes(status)) {
    errors.push('Invalid status query filter');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};
