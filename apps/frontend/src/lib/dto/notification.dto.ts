export interface NotificationResponse {
  id: string;
  user_id: string;
  title: string;
  message?: string;
  type: string;
  read: boolean;
  link?: string;
  created_at: string;
  updated_at?: string;
}
