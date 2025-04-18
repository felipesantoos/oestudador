import { AuthResponse, LoginRequest, RegisterRequest } from '../domains/user';
import { api } from '../config/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  }
}; 