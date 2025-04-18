export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
} 