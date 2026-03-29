import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user info' })
  @UseGuards(JwtAuthGuard)
  async me(@User() user: AuthenticatedUser) {
    return this.authService.me(user.id);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @UseGuards(JwtAuthGuard)
  async signIn(@User() user: AuthenticatedUser) {
    return this.authService.me(user.id);
  }
}
