import axios from 'axios';
import { AuthPort, LoginCredentials, RegisterData } from '../../../core/interfaces/primary/authPort';
import { AuthResponse, User } from '../../../core/domains/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class AuthRepository implements AuthPort {
  private api = axios.create({
    baseURL: API_URL,
    withCredentials: true
  });

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.api.get('/auth/me');
      return response.data.data.user;
    } catch {
      return null;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.api.post('/auth/refresh-token');
    return response.data;
  }
}