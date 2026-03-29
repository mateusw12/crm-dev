import { http } from '../api';
import type {
  CreateDealDto,
  UpdateDealDto,
  DealResponse,
  DealDetailResponse,
  DeletedResponse,
  GetDealsParams,
} from '../dto';

const API_BASE = '/deals';

export class DealsService {
  static async getAll(params?: GetDealsParams) {
    return http.get<DealResponse[]>(API_BASE, { params });
  }

  static async getById(id: string) {
    return http.get<DealDetailResponse>(`${API_BASE}/${id}`);
  }

  static async create(data: CreateDealDto) {
    return http.post<DealResponse>(API_BASE, data);
  }

  static async update(id: string, data: UpdateDealDto) {
    return http.put<DealResponse>(`${API_BASE}/${id}`, data);
  }

  static async delete(id: string) {
    return http.delete<DeletedResponse>(`${API_BASE}/${id}`);
  }
}
