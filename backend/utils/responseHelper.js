/**
 * Common Response Helpers for Express Controllers
 */

/**
 * Send a standardized success JSON response
 * @param {Response} res Express response object
 * @param {any} data Response payload
 * @param {string} message Success description message
 * @param {number} statusCode HTTP status code (default: 200)
 * @param {object} meta Additional metadata properties (e.g. pagination)
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...meta
  });
};

export const sendError = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

