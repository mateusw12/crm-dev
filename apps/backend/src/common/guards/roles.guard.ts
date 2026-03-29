import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../types';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('No user in request');
    }

    const roleHierarchy = {
      [UserRole.ADMIN]: 3,
      [UserRole.MANAGER]: 2,
      [UserRole.USER]: 1,
    };

    const userLevel = roleHierarchy[user.role as UserRole] ?? 0;
    const requiredLevel = Math.min(...requiredRoles.map((r) => roleHierarchy[r] ?? 99));

    if (userLevel < requiredLevel) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
