import { User, AuthUser } from '../../../core/domain/entities/user';
import { UserRepository } from '../../../core/ports/repositories';
import { httpClient } from '../api/httpClient';

export class ApiUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    return httpClient.get<User[]>('/users');
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await httpClient.get<User>(`/users/${id}`);
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const users = await httpClient.get<User[]>(`/users?email=${email}`);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      return null;
    }
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return httpClient.post<User>('/users', data);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return httpClient.patch<User>(`/users/${id}`, data);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await httpClient.delete(`/users/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  }

  async authenticate(email: string, password: string): Promise<AuthUser | null> {
    try {
      return await httpClient.post<AuthUser>('/auth/login', { email, password });
    } catch (error) {
      return null;
    }
  }
}