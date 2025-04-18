import { apiClient } from '../../../lib/axios';
import { User, AuthUser } from '../../../types';

export class AuthService {
  async login(email: string, password: string): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post<{ user: AuthUser; token: string }>('/auth/login', { 
        email, 
        password 
      });
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      return response.user || null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  async register(userData: Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const response = await apiClient.post<{ user: User; token: string }>('/auth/register', userData);
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      return response.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiClient.get<User>('/auth/me');
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  }

  async updatePassword(token: string, newPassword: string): Promise<boolean> {
    try {
      await apiClient.post(`/auth/reset-password/${token}`, { password: newPassword });
      return true;
    } catch (error) {
      console.error('Update password error:', error);
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      await apiClient.post('/auth/change-password', { 
        currentPassword,
        newPassword
      });
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();