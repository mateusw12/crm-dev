import { http } from '../api';
import type {
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponse,
  DeletedResponse,
  GetTasksParams,
} from '../dto';

const API_BASE = '/tasks';

export class TasksService {
  static async getAll(params?: GetTasksParams) {
    return http.get<TaskResponse[]>(API_BASE, { params });
  }

  static async getById(id: string) {
    return http.get<TaskResponse>(`${API_BASE}/${id}`);
  }

  static async create(data: CreateTaskDto) {
    return http.post<TaskResponse>(API_BASE, data);
  }

  static async update(id: string, data: UpdateTaskDto) {
    return http.put<TaskResponse>(`${API_BASE}/${id}`, data);
  }

  static async delete(id: string) {
    return http.delete<DeletedResponse>(`${API_BASE}/${id}`);
  }
}
