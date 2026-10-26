import { env } from '../config/env.js';
import { errorResponse } from '../utils/apiResponse.js';

export function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, `Invalid ID format for ${err.path}: ${err.value}`, 400, null, 'INVALID_ID');
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    return errorResponse(res, `Duplicate field value entered: ${fields.join(', ')} already exists`, 409, null, 'DUPLICATE_KEY');
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return errorResponse(res, 'Validation error', 422, details, 'VALIDATION_ERROR');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token. Please log in again.', 401, null, 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token has expired. Please log in again.', 401, null, 'TOKEN_EXPIRED');
  }

  const statusCode = err.statusCode || 500;
  const message = env.IS_PRODUCTION && statusCode === 500
    ? 'Internal Server Error. Please try again later.'
    : err.message || 'An unexpected error occurred.';

  return errorResponse(res, message, statusCode, null, err.code || 'SERVER_ERROR');
}
