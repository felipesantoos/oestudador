import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../core/domain/entities/user';
import { AuthService } from '../adapters/secondary/services/authService';
import { UserRepository } from '../adapters/secondary/repositories/userRepository';
import { AuthUseCase } from '../core/usecases/auth';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  fetchCurrentUser: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const authService = new AuthService();
const userRepository = new UserRepository();
const authUseCase = new AuthUseCase(authService, userRepository);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.login(email, password, rememberMe);
      
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during login';
      setError(message);
      toast.error(message);
      setIsLoading(false);
      return false;
    }
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.register(userData);
      setUser(user);
      setIsAuthenticated(true);
      setIsLoading(false);
      toast.success('Registration successful! Please check your email to verify your account.');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during registration';
      setError(message);
      toast.error(message);
      setIsLoading(false);
      return false;
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.verifyEmail(token);
      setIsLoading(false);
      toast.success('Email verified successfully!');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify email';
      setError(message);
      toast.error(message);
      setIsLoading(false);
      return false;
    }
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resendVerification(email);
      setIsLoading(false);
      toast.success('Verification email sent! Please check your inbox.');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend verification email';
      setError(message);
      toast.error(message);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred during logout';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logoutAll = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logoutAll();
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out from all devices');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to logout from all devices';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
      setIsAuthenticated(!!user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(email);
      setIsLoading(false);
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to process password reset';
      setError(message);
      toast.error(message);
      setIsLoading(false);
      return false;
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(token, newPassword);
      setIsLoading(false);
      toast.success('Password reset successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      setError(message);
      toast.error(message);
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
      toast.success('Password changed successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to change password';
      setError(message);
      toast.error(message);
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
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      setError(message);
      toast.error(message);
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
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    fetchCurrentUser,
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