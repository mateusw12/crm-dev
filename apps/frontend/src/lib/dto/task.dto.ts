import { TaskStatus } from './enums';
import type { ContactRef, DealRef } from './refs';

export interface GetTasksParams {
  status?: TaskStatus;
  contactId?: string;
  dealId?: string;
  dueDate?: string;
  page?: number;
  limit?: number;
}

export interface TaskListResponse {
  data: TaskResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  contactId?: string;
  dealId?: string;
}

export type UpdateTaskDto = Partial<CreateTaskDto>;

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: TaskStatus;
  contact_id?: string;
  deal_id?: string;
  created_by?: string;
  tenant_id?: string;
  created_at: string;
  updated_at?: string;
  contacts?: ContactRef;
  deals?: DealRef;
}
