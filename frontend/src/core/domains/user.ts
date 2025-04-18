export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'moderator';
  isEmailVerified: boolean;
  timezone: string;
  language: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    accessToken?: string;
  };
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