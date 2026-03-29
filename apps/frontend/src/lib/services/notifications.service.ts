import { http } from '../api';
import type { NotificationResponse } from '../dto';
import type { SuccessResponse } from '../dto';

const API_BASE = '/notifications';

export class NotificationsService {
  static async getAll() {
    return http.get<NotificationResponse[]>(API_BASE);
  }

  static async markRead(id: string) {
    return http.patch<NotificationResponse>(`${API_BASE}/${id}/read`);
  }

  static async markAllRead() {
    return http.patch<SuccessResponse>(`${API_BASE}/read-all`);
  }
}
