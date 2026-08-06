import { sendError } from '../utils/responseHelper.js';

export const validateCreateInquiry = (req, res, next) => {
  const { customer_name, phone, brand_id, model_id, status } = req.body;
  const errors = [];

  if (!customer_name || typeof customer_name !== 'string' || customer_name.trim() === '') {
    errors.push('Customer name is required');
  }
  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    errors.push('Customer phone number is required');
  }
  if (!brand_id) errors.push('Brand selection is required');
  if (!model_id) errors.push('Vehicle model selection is required');
  if (status && !['New', 'Contacted', 'Estimate Sent', 'Negotiation', 'Converted', 'Lost'].includes(status)) {
    errors.push('Invalid status value');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};

export const validateUpdateInquiry = (req, res, next) => {
  const { customer_name, phone, status } = req.body;
  const errors = [];

  if (customer_name !== undefined && (typeof customer_name !== 'string' || customer_name.trim() === '')) {
    errors.push('Customer name cannot be empty');
  }
  if (phone !== undefined && (typeof phone !== 'string' || phone.trim() === '')) {
    errors.push('Phone number cannot be empty');
  }
  if (status !== undefined && !['New', 'Contacted', 'Estimate Sent', 'Negotiation', 'Converted', 'Lost'].includes(status)) {
    errors.push('Invalid status value');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};

export const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['New', 'Contacted', 'Estimate Sent', 'Negotiation', 'Converted', 'Lost'];

  if (!status || !validStatuses.includes(status)) {
    return sendError(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
  }
  next();
};
