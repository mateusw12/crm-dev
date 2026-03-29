import { http } from '../api';
import httpClient from '../api/http-client';
import type {
  CreateDealDto,
  UpdateDealDto,
  DealResponse,
  DealDetailResponse,
  DeletedResponse,
  GetDealsParams,
} from '../dto';

const API_BASE = '/deals';

function downloadBlob(data: Blob, filename: string, mimeType: string) {
  const url = URL.createObjectURL(new Blob([data], { type: mimeType }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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

  static async exportCsv() {
    const res = await httpClient.get(`${API_BASE}/export/csv`, {
      responseType: 'blob',
    });
    downloadBlob(res.data, 'deals.csv', 'text/csv;charset=utf-8');
  }

  static async getReports(from: string, to: string) {
    return http.get<{
      period: { from: string; to: string };
      total: { count: number; value: number };
      won: { count: number; value: number };
      lost: { count: number; value: number };
      open: { count: number; value: number };
      dealsByStatus: { status: string; count: number; value: number }[];
    }>(`${API_BASE}/reports`, { params: { from, to } });
  }
}
