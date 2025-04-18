import { User, AuthResponse, PasswordResetRequest, PasswordResetConfirm, ChangePasswordRequest } from '../../domains/user';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  timezone: string;
  language: string;
  birthDate?: string;
}

export interface AuthPort {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  refreshToken(): Promise<AuthResponse>;
  verifyEmail(token: string): Promise<void>;
  resendVerification(email: string): Promise<void>;
  forgotPassword(data: PasswordResetRequest): Promise<void>;
  resetPassword(token: string, data: PasswordResetConfirm): Promise<void>;
  changePassword(data: ChangePasswordRequest): Promise<void>;
  logoutAll(): Promise<void>;
} 