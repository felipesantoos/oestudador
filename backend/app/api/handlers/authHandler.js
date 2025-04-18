import { AppError } from '../middlewares/errorMiddleware.js';
import {
  registerUserService,
  verifyEmailService,
  resendVerificationEmailService,
  loginUserService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
  changePasswordService,
  getUserByIdService,
  invalidateTokenService,
  invalidateAllTokensService
} from '../../../core/services/authService.js';

// Get the first allowed origin for redirects
const getFrontendUrl = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
  return allowedOrigins[0] || 'http://localhost:5174';
};

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password, timezone, language, birthDate } = req.body;
    
    const { user, verificationToken } = await registerUserService({
      name,
      email,
      password,
      timezone,
      language,
      birthDate
    });
    
    // Return success response without sensitive information
    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully. Please check your email to verify your account.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.is_email_verified
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Verify email address
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const user = await verifyEmailService(token);
    
    // Redirect to frontend with success message
    return res.redirect(`${getFrontendUrl()}/auth/verification-success`);
    
  } catch (error) {
    // Redirect to frontend with error message
    return res.redirect(`${getFrontendUrl()}/auth/verification-error?message=${encodeURIComponent(error.message)}`);
  }
};

// Resend verification email
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    await resendVerificationEmailService(email);
    
    return res.status(200).json({
      status: 'success',
      message: 'Verification email has been sent. Please check your inbox.'
    });
    
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe = false } = req.body;
    
    const { user, accessToken, refreshToken } = await loginUserService(email, password, rememberMe);
    
    // Set HTTP-only cookies for tokens
    const refreshExpires = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 7 days or 1 day
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshExpires
    });
    
    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.is_email_verified,
          avatar_url: user.avatar_url
        },
        accessToken // Include for clients that don't use cookies
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      await invalidateTokenService(refreshToken);
    }
    
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return res.status(200).json({
      status: 'success',
      message: 'Logout successful'
    });
    
  } catch (error) {
    next(error);
  }
};

// Refresh token
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    
    if (!token) {
      throw new AppError('Refresh token is required', 401, 'TOKEN_REQUIRED');
    }
    
    const { accessToken, refreshToken: newRefreshToken } = await refreshTokenService(token);
    
    // Set new cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    if (newRefreshToken) {
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
    }
    
    return res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        accessToken
      }
    });
    
  } catch (error) {
    // Clear cookies on error
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    next(error);
  }
};

// Forgot password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    await forgotPasswordService(email);
    
    return res.status(200).json({
      status: 'success',
      message: 'If the email exists in our system, you will receive a password reset link'
    });
    
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    await resetPasswordService(token, password);
    
    return res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
    
  } catch (error) {
    next(error);
  }
};

// Change password (authenticated)
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    await changePasswordService(userId, currentPassword, newPassword);
    
    return res.status(200).json({
      status: 'success',
      message: 'Password has been changed successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          isEmailVerified: req.user.is_email_verified,
          avatar_url: req.user.avatar_url,
          timezone: req.user.timezone,
          language: req.user.language
        }
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// Logout from all devices
export const logoutAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    await invalidateAllTokensService(userId);
    
    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return res.status(200).json({
      status: 'success',
      message: 'Logged out from all devices successfully'
    });
    
  } catch (error) {
    next(error);
  }
};