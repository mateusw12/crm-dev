import { http } from '../api';
import type {
  CreateCompanyDto,
  UpdateCompanyDto,
  CompanyResponse,
  CompanyDetailResponse,
  DeletedResponse,
  GetCompaniesParams,
} from '../dto';

const API_BASE = '/companies';

export class CompaniesService {
  static async getAll(params?: GetCompaniesParams) {
    return http.get<CompanyResponse[]>(API_BASE, { params });
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
}
