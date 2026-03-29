import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@User() user: AuthenticatedUser) {
    return this.notificationsService.findAll(user);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }

  @Patch('read-all')
  markAllRead(@User() user: AuthenticatedUser) {
    return this.notificationsService.markAllRead(user);
  }
}
