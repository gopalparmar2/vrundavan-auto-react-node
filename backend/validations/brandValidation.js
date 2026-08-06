import { sendError } from '../utils/responseHelper.js';

export const validateCreateBrand = (req, res, next) => {
  const { name, status } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Brand name is required');
  }
  if (status && !['active', 'inactive'].includes(status)) {
    errors.push('Status must be "active" or "inactive"');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};

export const validateUpdateBrand = (req, res, next) => {
  const { name, status } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    errors.push('Brand name cannot be empty');
  }
  if (status !== undefined && !['active', 'inactive'].includes(status)) {
    errors.push('Status must be "active" or "inactive"');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};
