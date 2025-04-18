import { apiClient } from '../../../lib/axios';
import { User, AuthUser } from '../../../types';

export class AuthService {
  async login(email: string, password: string, rememberMe: boolean = false): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post<{ status: string; message: string; data: { user: AuthUser; accessToken: string } }>('/auth/login', { 
        email, 
        password,
        rememberMe
      });
      
      if (response.data?.accessToken) {
        localStorage.setItem('auth_token', response.data.accessToken);
      }
      
      return response.data?.user || null;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to login. Please try again later.');
    }
  }

  async register(userData: Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const response = await apiClient.post<{ status: string; message: string; data: { user: User } }>('/auth/register', userData);
      return response.data?.user;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to create account. Please try again later.');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await apiClient.get(`/auth/verify-email/${token}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to verify email. Please try again later.');
    }
  }

  async resendVerification(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/resend-verification', { email });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to resend verification email. Please try again later.');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ status: string; data: { user: User } }>('/auth/me');
      return response.data?.user || null;
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('auth_token');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to logout. Please try again later.');
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await apiClient.post('/auth/logout-all');
      localStorage.removeItem('auth_token');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to logout from all devices. Please try again later.');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to process password reset request. Please try again later.');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await apiClient.post(`/auth/reset-password/${token}`, { password });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to reset password. Please try again later.');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/change-password', { 
        currentPassword,
        newPassword
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Unable to change password. Please try again later.');
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<{ status: string; data: { accessToken: string } }>('/auth/refresh-token');
      return response.data?.accessToken || null;
    } catch (error) {
      return null;
    }
  }
}

export const authService = new AuthService();