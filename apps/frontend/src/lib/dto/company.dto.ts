import type { ContactRef } from './refs';

export interface GetCompaniesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CompanyListResponse {
  data: CompanyResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateCompanyDto {
  name: string;
  cnpj: string;
  cep: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  notes?: string;
  logoUrl?: string;
}

export type UpdateCompanyDto = Partial<CreateCompanyDto>;

export interface CompanyResponse {
  id: string;
  name: string;
  cnpj?: string;
  cep?: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  notes?: string;
  logo_url?: string;
  created_by?: string;
  tenant_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface CepResponse {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export interface CompanyDetailResponse extends CompanyResponse {
  contacts?: ContactRef[];
}
