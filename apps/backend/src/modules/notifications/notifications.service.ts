import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../../common/types';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async findAll(currentUser: AuthenticatedUser) {
    return this.notificationsRepository.findByUser(currentUser.id);
  }

  async markRead(id: string) {
    return this.notificationsRepository.markRead(id);
  }

  async markAllRead(currentUser: AuthenticatedUser) {
    await this.notificationsRepository.markAllRead(currentUser.id);
    return { success: true };
  }
}
