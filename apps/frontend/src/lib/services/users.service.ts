import { http } from '../api';
import type { UserResponse } from '../dto';

export class UsersService {
  static async getAll() {
    return http.get<UserResponse[]>('/users');
  }

  static async getMe() {
    return http.get<UserResponse>('/auth/me');
  }
}
