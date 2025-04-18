import { create } from 'zustand';
import { User } from '../../core/domain/entities/user';
import { ApiAuthService } from '../secondary/services/authService';
import { ApiUserRepository } from '../secondary/repositories/userRepository';
import { AuthUseCase } from '../../core/usecases/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (token: string, newPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
}

// Create instances of services and use cases
const authService = new ApiAuthService();
const userRepository = new ApiUserRepository();
const authUseCase = new AuthUseCase(authService, userRepository);

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authUseCase.login(email, password);
      
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
        return true;
      } else {
        set({ error: 'Invalid credentials', isLoading: false });
        return false;
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred during login', 
        isLoading: false 
      });
      return false;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authUseCase.register(userData);
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred during registration', 
        isLoading: false 
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authUseCase.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logoutAll: async () => {
    set({ isLoading: true });
    try {
      await authService.logoutAll();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to logout from all devices', 
        isLoading: false 
      });
    }
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true });
    try {
      const user = await authUseCase.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch user', 
        isLoading: false 
      });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await authUseCase.resetPassword(email);
      set({ isLoading: false });
      return success;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to reset password', 
        isLoading: false 
      });
      return false;
    }
  },

  updatePassword: async (token: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await authService.updatePassword(token, newPassword);
      set({ isLoading: false });
      return success;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update password', 
        isLoading: false 
      });
      return false;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ isLoading: true, error: null });
    const { user } = get();
    
    if (!user) {
      set({ error: 'Not authenticated', isLoading: false });
      return false;
    }
    
    try {
      await authService.changePassword(currentPassword, newPassword);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to change password', 
        isLoading: false 
      });
      return false;
    }
  },

  updateProfile: async (profileData: Partial<User>) => {
    set({ isLoading: true, error: null });
    const { user } = get();
    
    if (!user) {
      set({ error: 'Not authenticated', isLoading: false });
      return false;
    }
    
    try {
      const updatedUser = await authUseCase.updateProfile(user.id, profileData);
      set({ user: updatedUser, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile', 
        isLoading: false 
      });
      return false;
    }
  }
}));