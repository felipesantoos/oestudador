import { AuthService } from '../../../core/ports/services';
import { User, AuthUser } from '../../../core/domain/entities/user';
import { httpClient } from '../api/httpClient';

export class ApiAuthService implements AuthService {
  async login(email: string, password: string): Promise<AuthUser | null> {
    try {
      const response = await httpClient.post<{ user: AuthUser; token: string }>('/auth/login', { email, password });
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      return response.user;
    } catch (error) {
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await httpClient.post('/auth/logout-all');
    } finally {
      localStorage.removeItem('auth_token');
    }
  }

  async register(userData: Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await httpClient.post<{ user: User; token: string }>('/auth/register', userData);
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response.user;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await httpClient.get<User>('/auth/me');
    } catch (error) {
      return null;
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      await httpClient.post('/auth/forgot-password', { email });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updatePassword(token: string, newPassword: string): Promise<boolean> {
    try {
      await httpClient.post(`/auth/reset-password/${token}`, { password: newPassword });
      return true;
    } catch (error) {
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      await httpClient.post('/auth/change-password', { 
        currentPassword,
        newPassword
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}