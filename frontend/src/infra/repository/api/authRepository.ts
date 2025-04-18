import axios from 'axios';
import { AuthPort, LoginCredentials, RegisterData } from '../../../core/interfaces/primary/authPort';
import { AuthResponse, User, PasswordResetRequest, PasswordResetConfirm, ChangePasswordRequest } from '../../../core/domains/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class AuthRepository implements AuthPort {
  private api = axios.create({
    baseURL: API_URL,
    withCredentials: true
  });

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.api.get('/auth/me');
      return response.data.data.user;
    } catch {
      return null;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await this.api.get(`/auth/verify-email/${token}`);
    } catch (error) {
      throw new Error('Email verification failed');
    }
  }

  async resendVerification(email: string): Promise<void> {
    try {
      await this.api.post('/auth/resend-verification', { email });
    } catch (error) {
      throw new Error('Failed to resend verification email');
    }
  }

  async forgotPassword(data: PasswordResetRequest): Promise<void> {
    try {
      await this.api.post('/auth/forgot-password', data);
    } catch (error) {
      throw new Error('Failed to request password reset');
    }
  }

  async resetPassword(token: string, data: PasswordResetConfirm): Promise<void> {
    try {
      await this.api.post(`/auth/reset-password/${token}`, data);
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      await this.api.post('/auth/change-password', data);
    } catch (error) {
      throw new Error('Failed to change password');
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await this.api.post('/auth/logout-all');
    } catch (error) {
      throw new Error('Failed to logout from all devices');
    }
  }
} 