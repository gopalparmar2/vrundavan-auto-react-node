import { sendError } from '../utils/responseHelper.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred';

  return sendError(res, message, statusCode, err.errors || null);
};
