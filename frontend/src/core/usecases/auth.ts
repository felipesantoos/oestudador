import { AuthService } from '../ports/services';
import { UserRepository } from '../ports/repositories';
import { User, AuthUser } from '../domain/entities/user';

export class AuthUseCase {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository
  ) {}

  async login(email: string, password: string): Promise<AuthUser | null> {
    return this.authService.login(email, password);
  }

  async register(userData: Omit<User, 'id' | 'role' | 'isEmailVerified' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.authService.register(userData);
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authService.getCurrentUser();
  }

  async logout(): Promise<void> {
    return this.authService.logout();
  }

  async resetPassword(email: string): Promise<boolean> {
    return this.authService.resetPassword(email);
  }

  async updateProfile(userId: string, profileData: Partial<User>): Promise<User> {
    return this.userRepository.update(userId, profileData);
  }
}