import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@User() user: AuthenticatedUser) {
    return this.authService.me(user.id);
  }

  @Post('signin')
  @UseGuards(JwtAuthGuard)
  async signIn(@User() user: AuthenticatedUser) {
    return this.authService.me(user.id);
  }
}
