import { http } from '../api';
import httpClient from '../api/http-client';
import type {
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyResponse,
  CompanyDetailResponse,
  CompanyListResponse,
  CepResponse,
  DeletedResponse,
  GetCompaniesParams,
} from '../dto';

const API_BASE = '/companies';

function downloadBlob(data: Blob, filename: string, mimeType: string) {
  const url = URL.createObjectURL(new Blob([data], { type: mimeType }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export class CompaniesService {
  static async getAll(params?: GetCompaniesParams) {
    return http.get<CompanyListResponse>(API_BASE, { params });
  }

  static async getById(id: string) {
    return http.get<CompanyDetailResponse>(`${API_BASE}/${id}`);
  }

  static async create(data: CreateCompanyDto) {
    return http.post<CompanyResponse>(API_BASE, data);
  }

  static async update(id: string, data: UpdateCompanyDto) {
    return http.put<CompanyResponse>(`${API_BASE}/${id}`, data);
  }

  static async delete(id: string) {
    return http.delete<DeletedResponse>(`${API_BASE}/${id}`);
  }

  static async lookupCep(cep: string) {
    return http.get<CepResponse>(`${API_BASE}/cep/${cep.replace(/\D/g, '')}`);
  }

  static async exportCsv() {
    const res = await httpClient.get(`${API_BASE}/export/csv`, {
      responseType: 'blob',
    });
    downloadBlob(res.data, 'companies.csv', 'text/csv;charset=utf-8');
  }
}
