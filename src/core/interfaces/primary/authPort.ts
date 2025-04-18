import { User, AuthResponse } from '@core/domains/user';

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
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  refreshToken: () => Promise<AuthResponse>;
}