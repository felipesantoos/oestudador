import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@core/domains/user';
import { AuthService } from '@core/services/authService';
import { AuthRepository } from '@infra/repository/api/authRepository';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string, timezone: string, language: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authService = new AuthService(new AuthRepository());

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string, rememberMe = false) {
    const response = await authService.login({ email, password, rememberMe });
    setUser(response.data.user);
  }

  async function register(name: string, email: string, password: string, timezone: string, language: string) {
    const response = await authService.register({ name, email, password, timezone, language });
    setUser(response.data.user);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}