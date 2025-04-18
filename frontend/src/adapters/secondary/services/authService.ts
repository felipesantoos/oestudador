import { apiClient } from '../../../lib/axios';
import { User, AuthUser } from '../../../types';

export class AuthService {
  async login(email: string, password: string): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post<{ status: string; message: string; data: { user: AuthUser; accessToken: string } }>('/auth/login', { 
        email, 
        password 
      });
      
      if (response.data?.accessToken) {
        localStorage.setItem('auth_token', response.data.accessToken);
      }
      
      return response.data?.user || null;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async register(userData: Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const response = await apiClient.post<{ status: string; message: string; data: { user: User; accessToken: string } }>('/auth/register', userData);
      
      if (response.data?.accessToken) {
        localStorage.setItem('auth_token', response.data.accessToken);
      }
      
      return response.data?.user;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ status: string; data: { user: User } }>('/auth/me');
      return response.data?.user || null;
    } catch (error) {
      console.error('Get current user error:', error);
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
      throw error;
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
      return true;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async updatePassword(token: string, newPassword: string): Promise<boolean> {
    try {
      await apiClient.post(`/auth/reset-password/${token}`, { password: newPassword });
      return true;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      await apiClient.post('/auth/change-password', { 
        currentPassword,
        newPassword
      });
      return true;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  }
}

export const authService = new AuthService();