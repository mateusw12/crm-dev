import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../common/types';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getOrCreateUser(payload: JwtPayload) {
    try {
      return await this.authRepository.findOrCreateUser(payload);
    } catch {
      throw new UnauthorizedException('Failed to create user');
    }
  }

  async me(userId: string) {
    const user = await this.authRepository.findMe(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
