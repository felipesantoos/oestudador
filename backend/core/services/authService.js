import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../domains/userDomain.js';
import { AppError } from '../../app/api/middlewares/errorMiddleware.js';
import { userRepository } from '../../infra/repository/postgres/userRepository.js';
import { emailService } from './emailService.js';

/**
 * Register a new user
 */
export const registerUserService = async (userData) => {
  // Check if email already exists
  const emailExists = await userRepository.emailExists(userData.email);
  if (emailExists) {
    throw new AppError('Email is already in use', 400, 'EMAIL_IN_USE');
  }

  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(userData.password, saltRounds);

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // Create user object
  const user = new User({
    name: userData.name,
    email: userData.email.toLowerCase(),
    password_hash: passwordHash,
    timezone: userData.timezone,
    language: userData.language,
    birth_date: userData.birthDate,
    email_verification_token: verificationToken,
    email_verification_sent_at: new Date()
  });

  // Save user to database
  const savedUser = await userRepository.createUser(user.toDatabase());

  // Send verification email
  await emailService.sendVerificationEmail(
    savedUser.email,
    savedUser.name,
    verificationToken
  );

  return {
    user: User.fromDatabase(savedUser),
    verificationToken
  };
};

/**
 * Verify user email
 */
export const verifyEmailService = async (token) => {
  // Find user by verification token
  const user = await userRepository.findByEmailVerificationToken(token);
  
  if (!user) {
    throw new AppError('Invalid or expired verification token', 400, 'INVALID_TOKEN');
  }
  
  // Check if token is expired (24 hours)
  const tokenSentAt = new Date(user.email_verification_sent_at);
  const now = new Date();
  const hoursDifference = (now - tokenSentAt) / (1000 * 60 * 60);
  
  if (hoursDifference > 24) {
    throw new AppError('Verification token has expired', 400, 'TOKEN_EXPIRED');
  }
  
  // Update user as verified
  const updatedUser = await userRepository.updateUser(user.id, {
    is_email_verified: true,
    email_verification_token: null,
    email_verification_sent_at: null,
    updated_at: new Date()
  });
  
  return updatedUser;
};

/**
 * Resend verification email
 */
export const resendVerificationEmailService = async (email) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  
  if (!user) {
    // Don't reveal that the email doesn't exist
    return true;
  }
  
  // Check if email is already verified
  if (user.is_email_verified) {
    throw new AppError('Email is already verified', 400, 'ALREADY_VERIFIED');
  }
  
  // Generate new verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Update user with new token
  const updatedUser = await userRepository.updateUser(user.id, {
    email_verification_token: verificationToken,
    email_verification_sent_at: new Date(),
    updated_at: new Date()
  });
  
  // Send verification email
  await emailService.sendVerificationEmail(
    updatedUser.email,
    updatedUser.name,
    verificationToken
  );
  
  return {
    user: updatedUser,
    verificationToken
  };
};

/**
 * Login user
 */
export const loginUserService = async (email, password, rememberMe = false) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  
  // Check if user exists
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }
  
  // Check if account is soft deleted
  if (user.deleted_at) {
    throw new AppError('This account has been deactivated', 401, 'ACCOUNT_DEACTIVATED');
  }
  
  // Check if account is locked
  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    throw new AppError(
      `Your account has been locked. Please try again after ${new Date(user.locked_until).toLocaleString()}`,
      403,
      'ACCOUNT_LOCKED'
    );
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  
  if (!isPasswordValid) {
    // Increment login attempts
    await userRepository.incrementLoginAttempts(user.id);
    
    // Check if we need to lock the account (after 5 attempts)
    const updatedUser = await userRepository.findById(user.id);
    
    if (updatedUser.login_attempts >= 5) {
      // Lock account for 30 minutes
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + 30);
      
      await userRepository.lockAccount(user.id, lockUntil);
      
      throw new AppError(
        `Too many failed login attempts. Your account has been locked until ${lockUntil.toLocaleString()}`,
        403,
        'ACCOUNT_LOCKED'
      );
    }
    
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }
  
  // Reset login attempts if successful
  await userRepository.resetLoginAttempts(user.id);
  
  // Check if email is verified
  if (!user.is_email_verified) {
    throw new AppError(
      'Email not verified. Please verify your email before logging in',
      403,
      'EMAIL_NOT_VERIFIED'
    );
  }
  
  // Update last login timestamp
  await userRepository.updateLastLogin(user.id);
  
  // Generate JWT tokens
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  
  // Store refresh token in database
  await userRepository.updateUser(user.id, {
    session_token: refreshToken,
    updated_at: new Date()
  });
  
  return {
    user,
    accessToken,
    refreshToken
  };
};

/**
 * Generate access token
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Refresh token
 */
export const refreshTokenService = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (!decoded || decoded.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }
    
    // Find user by refresh token
    const user = await userRepository.findByRefreshToken(refreshToken);
    
    if (!user) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }
    
    // Check if account is soft deleted
    if (user.deleted_at) {
      throw new AppError('This account has been deactivated', 401, 'ACCOUNT_DEACTIVATED');
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(user.id);
    
    // Check if refresh token is about to expire (less than 1 day)
    const tokenExp = decoded.exp * 1000;
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    let newRefreshToken = null;
    
    if (tokenExp - now < oneDayInMs) {
      // Generate new refresh token
      newRefreshToken = generateRefreshToken(user.id);
      
      // Update refresh token in database
      await userRepository.updateUser(user.id, {
        session_token: newRefreshToken,
        updated_at: new Date()
      });
    }
    
    return {
      accessToken,
      refreshToken: newRefreshToken
    };
    
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
  }
};

/**
 * Forgot password service
 */
export const forgotPasswordService = async (email) => {
  // Find user by email
  const user = await userRepository.findByEmail(email);
  
  if (!user || user.deleted_at) {
    // Don't reveal that the email doesn't exist
    return true;
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Set token expiration (1 hour)
  const resetExpires = new Date();
  resetExpires.setHours(resetExpires.getHours() + 1);
  
  // Update user with reset token
  await userRepository.updateUser(user.id, {
    password_reset_token: resetToken,
    password_reset_expires_at: resetExpires,
    updated_at: new Date()
  });
  
  // Send password reset email
  await emailService.sendPasswordResetEmail(
    user.email,
    user.name,
    resetToken
  );
  
  return true;
};

/**
 * Reset password service
 */
export const resetPasswordService = async (token, newPassword) => {
  // Find user by reset token
  const user = await userRepository.findByPasswordResetToken(token);
  
  if (!user) {
    throw new AppError('Invalid or expired password reset token', 400, 'INVALID_TOKEN');
  }
  
  // Check if token has expired
  if (new Date(user.password_reset_expires_at) < new Date()) {
    throw new AppError('Password reset token has expired', 400, 'TOKEN_EXPIRED');
  }
  
  // Hash new password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(newPassword, saltRounds);
  
  // Update user with new password
  const updatedUser = await userRepository.updateUser(user.id, {
    password_hash: passwordHash,
    password_reset_token: null,
    password_reset_expires_at: null,
    updated_at: new Date()
  });
  
  return updatedUser;
};

/**
 * Change password service (authenticated)
 */
export const changePasswordService = async (userId, currentPassword, newPassword) => {
  // Find user by ID
  const user = await userRepository.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  
  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
  
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 400, 'INVALID_PASSWORD');
  }
  
  // Hash new password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(newPassword, saltRounds);
  
  // Update user with new password
  const updatedUser = await userRepository.updateUser(userId, {
    password_hash: passwordHash,
    updated_at: new Date()
  });
  
  return updatedUser;
};

/**
 * Get user by ID service
 */
export const getUserByIdService = async (userId) => {
  const user = await userRepository.findById(userId);
  return user;
};

/**
 * Invalidate token service
 */
export const invalidateTokenService = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (!decoded || decoded.type !== 'refresh') {
      return true;
    }
    
    // Find user by refresh token
    const user = await userRepository.findByRefreshToken(refreshToken);
    
    if (!user) {
      return true;
    }
    
    // Invalidate token
    await userRepository.updateUser(user.id, {
      session_token: null,
      updated_at: new Date()
    });
    
    return true;
    
  } catch (error) {
    // Token is invalid, already expired, or can't be verified
    return true;
  }
};

/**
 * Invalidate all tokens service
 */
export const invalidateAllTokensService = async (userId) => {
  await userRepository.updateUser(userId, {
    session_token: null,
    updated_at: new Date()
  });
  
  return true;
};