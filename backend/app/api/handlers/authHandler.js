import { AppError } from '../middlewares/errorMiddleware.js';
import { AuthService } from '../../../core/services/authService.js';

const authService = new AuthService();

// Get the first allowed origin for redirects
const getFrontendUrl = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
  return allowedOrigins[0] || 'http://localhost:5174';
};

// Register a new user
export const registerUserHandler = async (req, res, next) => {
  try {
    const result = await authService.registerUserService(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Verify email address
export const verifyEmailHandler = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await authService.verifyEmailService(token);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Resend verification email
export const resendVerificationEmailHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.resendVerificationEmailService(email);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};

// Login user
export const loginUserHandler = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const result = await authService.loginUserService(email, password, rememberMe);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logoutUserHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.invalidateTokenService(refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// Refresh token
export const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokenService(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Forgot password
export const forgotPasswordHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPasswordService(email);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

// Reset password
export const resetPasswordHandler = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await authService.resetPasswordService(token, newPassword);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Change password (authenticated)
export const changePasswordHandler = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await authService.changePasswordService(req.user.id, currentPassword, newPassword);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getUserProfileHandler = async (req, res, next) => {
  try {
    const user = await authService.getUserByIdService(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Logout from all devices
export const logoutAllDevicesHandler = async (req, res, next) => {
  try {
    await authService.invalidateAllTokensService(req.user.id);
    res.status(200).json({ message: 'Logged out from all devices' });
  } catch (error) {
    next(error);
  }
};