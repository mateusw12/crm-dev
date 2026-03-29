import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtPayload, AuthenticatedUser } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('error.invalidToken');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret });

      const dbUser = await this.authService.getOrCreateUser(payload);

      const user: AuthenticatedUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        picture: dbUser.picture,
        role: dbUser.role,
        tenantId: dbUser.manager_id ?? undefined,
      };

      request.user = user;
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      console.error('[JwtAuthGuard] Error:', err);
      throw new UnauthorizedException('error.invalidToken');
    }
  }

  private extractToken(request: any): string | undefined {
    const authHeader = request.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return undefined;
  }
}
