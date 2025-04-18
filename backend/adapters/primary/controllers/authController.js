import { AuthService } from '../../../core/services/authService.js';

const authService = new AuthService();

export const registerUser = async (req, res, next) => {
  try {
    const result = await authService.registerUserService(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const user = await authService.verifyEmailService(token);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.resendVerificationEmailService(email);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;
    const result = await authService.loginUserService(email, password, rememberMe);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokenService(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPasswordService(email);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await authService.resetPasswordService(token, newPassword);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await authService.changePasswordService(req.user.id, currentPassword, newPassword);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserByIdService(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.invalidateTokenService(refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const logoutAllDevices = async (req, res, next) => {
  try {
    await authService.invalidateAllTokensService(req.user.id);
    res.status(200).json({ message: 'Logged out from all devices' });
  } catch (error) {
    next(error);
  }
}; 