import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthRepository } from '@infra/repository/api/authRepository';
import { User, AuthResponse } from '@core/domains/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authRepository = new AuthRepository();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authRepository.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authRepository.login({ email, password });
      setUser(response.data.user);
    } catch (err) {
      setError('Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authRepository.logout();
      setUser(null);
    } catch (err) {
      setError('Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authRepository.register(data);
      setUser(response.data.user);
    } catch (err) {
      setError('Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authRepository.refreshToken();
      setUser(response.data.user);
    } catch (err) {
      setError('Token refresh failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 