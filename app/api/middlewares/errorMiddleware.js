const { logger } = require('../../shared/logger');

class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error({
    message: err.message,
    error: err,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Handle specific error types
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      code: err.errorCode || 'ERROR',
      message: err.message
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation error',
      errors: err.errors
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Invalid token. Please log in again.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      code: 'EXPIRED_TOKEN',
      message: 'Your token has expired. Please log in again.'
    });
  }

  // Handle database errors
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      status: 'error',
      code: 'DATABASE_ERROR',
      message: 'Database constraint violation'
    });
  }

  // Default to 500 server error for unhandled errors
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message
  });
};

module.exports = { 
  AppError,
  errorHandler
};