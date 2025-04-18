const { validationResult } = require('express-validator');
const { AppError } = require('./errorMiddleware');

// Validate request based on express-validator rules
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      if (!acc[error.path]) {
        acc[error.path] = [];
      }
      acc[error.path].push(error.msg);
      return acc;
    }, {});

    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

module.exports = { validateRequest };