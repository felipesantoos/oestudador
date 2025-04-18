export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'moderator';
  isEmailVerified: boolean;
  timezone: string;
  language: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    accessToken?: string;
  };
}