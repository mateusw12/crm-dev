import { http } from '../api';
import type {
  CreateInteractionDto,
  UpdateInteractionDto,
  InteractionResponse,
  DeletedResponse,
} from '../dto';

const API_BASE = '/interactions';

export class InteractionsService {
  static async getAll(contactId: string) {
    return http.get<InteractionResponse[]>(API_BASE, { params: { contactId } });
  }

  static async create(data: CreateInteractionDto) {
    return http.post<InteractionResponse>(API_BASE, data);
  }

  static async update(id: string, data: UpdateInteractionDto) {
    return http.put<InteractionResponse>(`${API_BASE}/${id}`, data);
  }

  static async delete(id: string) {
    return http.delete<DeletedResponse>(`${API_BASE}/${id}`);
  }
}
