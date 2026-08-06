import { sendError } from '../utils/responseHelper.js';

export const validateCreateModel = (req, res, next) => {
  const { brand_id, name, variant, on_road_price, fuel_type, transmission } = req.body;
  const errors = [];

  if (!brand_id) errors.push('Brand ID is required');
  if (!name || typeof name !== 'string' || name.trim() === '') errors.push('Model name is required');
  if (!variant || typeof variant !== 'string' || variant.trim() === '') errors.push('Variant is required');
  if (on_road_price === undefined || isNaN(Number(on_road_price))) errors.push('Valid on-road price is required');
  if (!fuel_type || !['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].includes(fuel_type)) {
    errors.push('Valid fuel type (Petrol, Diesel, CNG, Electric, Hybrid) is required');
  }
  if (!transmission || !['Manual', 'Automatic'].includes(transmission)) {
    errors.push('Valid transmission (Manual, Automatic) is required');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};

export const validateUpdateModel = (req, res, next) => {
  const { fuel_type, transmission, on_road_price } = req.body;
  const errors = [];

  if (on_road_price !== undefined && isNaN(Number(on_road_price))) {
    errors.push('On-road price must be a valid number');
  }
  if (fuel_type !== undefined && !['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].includes(fuel_type)) {
    errors.push('Invalid fuel type');
  }
  if (transmission !== undefined && !['Manual', 'Automatic'].includes(transmission)) {
    errors.push('Invalid transmission type');
  }

  if (errors.length > 0) {
    return sendError(res, errors[0], 400, errors);
  }
  next();
};
