import { http } from '../api';
import type { UserResponse } from '../dto';

export class AuthService {
  static async getUser() {
    return http.get<UserResponse>('/auth/me');
  }
}
