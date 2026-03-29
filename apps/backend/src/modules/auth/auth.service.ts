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
      throw new UnauthorizedException('error.invalidToken');
    }
  }

  async getOrCreateUser(payload: JwtPayload) {
    try {
      return await this.authRepository.findOrCreateUser(payload);
    } catch (err) {
      console.error('[AuthService] getOrCreateUser failed:', err);
      throw new UnauthorizedException('error.default');
    }
  }

  async me(userId: string) {
    const user = await this.authRepository.findMe(userId);
    if (!user) throw new UnauthorizedException('error.userNotFound');
    return user;
  }
}
