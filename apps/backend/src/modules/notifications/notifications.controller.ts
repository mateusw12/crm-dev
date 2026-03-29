import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  findAll(@User() user: AuthenticatedUser) {
    return this.notificationsService.findAll(user);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read by ID' })
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read for the current user' })

  markAllRead(@User() user: AuthenticatedUser) {
    return this.notificationsService.markAllRead(user);
  }
}
