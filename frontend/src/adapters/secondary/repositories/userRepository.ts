import { User, AuthUser } from '../../../core/domain/entities/user';
import { UserRepository as IUserRepository } from '../../../core/ports/repositories';
import { apiClient } from '../../../lib/axios';

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    return apiClient.get<User[]>('/users');
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await apiClient.get<User>(`/users/${id}`);
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const users = await apiClient.get<User[]>(`/users?email=${email}`);
      return users[0] || null;
    } catch (error) {
      return null;
    }
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return apiClient.post<User>('/users', data);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return apiClient.patch<User>(`/users/${id}`, data);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/users/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async authenticate(email: string, password: string): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post<{ user: AuthUser; token: string }>('/auth/login', { email, password });
      return response.user;
    } catch (error) {
      return null;
    }
  }
}