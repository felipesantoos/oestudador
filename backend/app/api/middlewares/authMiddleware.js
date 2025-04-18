import jwt from 'jsonwebtoken';
import { AppError } from './errorMiddleware.js';
import { getUserByIdService } from '../../../core/services/userService.js';

export const authenticate = async (req, res, next) => {
  try {
    // 1. Check if token exists
    const token = req.cookies.accessToken || 
                 (req.headers.authorization && req.headers.authorization.startsWith('Bearer') 
                    ? req.headers.authorization.split(' ')[1] 
                    : null);

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED');
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const currentUser = await getUserByIdService(decoded.id);
    
    if (!currentUser) {
      throw new AppError('The user belonging to this token no longer exists.', 401, 'USER_NOT_FOUND');
    }

    // 4. Check if user's account is locked
    if (currentUser.locked_until && new Date(currentUser.locked_until) > new Date()) {
      throw new AppError(
        `Your account has been locked. Please try again after ${new Date(currentUser.locked_until).toLocaleString()}.`, 
        403, 
        'ACCOUNT_LOCKED'
      );
    }

    // 5. Check if user is soft deleted
    if (currentUser.deleted_at) {
      throw new AppError('This account has been deactivated.', 401, 'ACCOUNT_DEACTIVATED');
    }

    // 6. If everything passes, set user in request and continue
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401, 'INVALID_TOKEN'));
    }
    
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your token has expired. Please log in again.', 401, 'EXPIRED_TOKEN'));
    }
    
    next(error);
  }
};

// Middleware for role-based access control
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403, 'FORBIDDEN'));
    }
    
    next();
  };
};