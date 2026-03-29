import { http } from '../api';
import httpClient from '../api/http-client';
import type {
  CreateContactDto,
  UpdateContactDto,
  ContactResponse,
  ContactDetailResponse,
  ContactListResponse,
  DeletedResponse,
  GetContactsParams,
} from '../dto';

const API_BASE = '/contacts';

function downloadBlob(data: Blob, filename: string, mimeType: string) {
  const url = URL.createObjectURL(new Blob([data], { type: mimeType }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export class ContactsService {
  static async getAll(params?: GetContactsParams) {
    return http.get<ContactListResponse>(API_BASE, { params });
  }

  static async getById(id: string) {
    return http.get<ContactDetailResponse>(`${API_BASE}/${id}`);
  }

  static async create(data: CreateContactDto) {
    return http.post<ContactResponse>(API_BASE, data);
  }

  static async update(id: string, data: UpdateContactDto) {
    return http.put<ContactResponse>(`${API_BASE}/${id}`, data);
  }

  static async delete(id: string) {
    return http.delete<DeletedResponse>(`${API_BASE}/${id}`);
  }

  static async exportCsv() {
    const res = await httpClient.get(`${API_BASE}/export/csv`, {
      responseType: 'blob',
    });
    downloadBlob(res.data, 'contacts.csv', 'text/csv;charset=utf-8');
  }

  static async importPreview(rows: Record<string, string>[]) {
    return http.post<{
      total: number;
      validCount: number;
      invalidCount: number;
      rows: {
        row: number;
        data: Record<string, string>;
        errors: { field: string; messages: string[] }[];
      }[];
    }>(`${API_BASE}/import/preview`, { rows });
  }

  static async importConfirm(rows: CreateContactDto[]) {
    return http.post<{ created: number; errors: { row: number; message: string }[] }>(
      `${API_BASE}/import/confirm`,
      { rows },
    );
  }
}
