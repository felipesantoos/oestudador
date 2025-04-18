import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../core/domain/entities/user';
import { ApiAuthService } from '../adapters/secondary/services/authService';
import { UserRepository } from '../adapters/secondary/repositories/userRepository';
import { AuthUseCase } from '../core/usecases/auth';

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | null>(null);

// Create instances of services and use cases
const authService = new ApiAuthService();
const userRepository = new UserRepository();
const authUseCase = new AuthUseCase(authService, userRepository);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authUseCase.login(email, password);
      
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during login');
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authUseCase.register(userData);
      setUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during registration');
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authUseCase.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  const logoutAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logoutAll();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to logout from all devices');
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await authUseCase.getCurrentUser();
      setUser(user);
      setIsAuthenticated(!!user);
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch user');
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(email);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reset password');
      setIsLoading(false);
      return false;
    }
  }, []);

  const updatePassword = useCallback(async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.updatePassword(token, newPassword);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update password');
      setIsLoading(false);
      return false;
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to change password');
      setIsLoading(false);
      return false;
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userRepository.update(user?.id || '', profileData);
      setUser(updatedUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile');
      setIsLoading(false);
      return false;
    }
  }, [user?.id]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    logoutAll,
    fetchCurrentUser,
    resetPassword,
    updatePassword,
    changePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 