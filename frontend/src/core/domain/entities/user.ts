export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'student' | 'admin' | 'moderator';
  isEmailVerified: boolean;
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