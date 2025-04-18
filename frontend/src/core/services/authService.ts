import { AuthPort, LoginCredentials, RegisterData } from '../interfaces/primary/authPort';
import { User, AuthResponse } from '../domains/user';

export class AuthService {
  constructor(private readonly authPort: AuthPort) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.authPort.login(credentials);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.authPort.register(data);
  }

  async logout(): Promise<void> {
    return this.authPort.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authPort.getCurrentUser();
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.authPort.refreshToken();
  }
}