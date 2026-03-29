import type { CompanyRef } from './refs';
import type { InteractionResponse } from './interaction.dto';
import type { DealResponse } from './deal.dto';
import type { TaskResponse } from './task.dto';

export interface GetContactsParams {
  search?: string;
  companyId?: string;
  page?: number;
  limit?: number;
}

export interface CreateContactDto {
  name: string;
  email?: string;
  phone?: string;
  companyId?: string;
  notes?: string;
  avatarUrl?: string;
}

export type UpdateContactDto = Partial<CreateContactDto>;

export interface ContactResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company_id?: string;
  notes?: string;
  avatar_url?: string;
  created_by: string;
  updated_by?: string;
  tenant_id?: string;
  created_at: string;
  updated_at?: string;
  companies?: CompanyRef;
}

export interface ContactDetailResponse extends ContactResponse {
  interactions?: InteractionResponse[];
  deals?: DealResponse[];
  tasks?: TaskResponse[];
}

export interface ContactListResponse {
  data: ContactResponse[];
  total: number;
  page: number;
  limit: number;
}
