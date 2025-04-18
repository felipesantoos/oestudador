export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'moderator';
  isEmailVerified: boolean;
  avatarUrl?: string;
  timezone?: string;
  language?: string;
  birthDate?: string;
  notificationsEnabled: boolean;
  authProvider?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  sessionToken: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'> {
  password: string;
}

export interface PasswordResetData {
  email: string;
}

export interface PasswordUpdateData {
  password: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
} 