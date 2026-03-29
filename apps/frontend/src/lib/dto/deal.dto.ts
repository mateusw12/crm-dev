import { DealStatus } from './enums';
import type { ContactRef } from './refs';
import type { TaskResponse } from './task.dto';

export interface GetDealsParams {
  status?: DealStatus;
  contactId?: string;
}

export interface CreateDealDto {
  title: string;
  value?: number;
  status: DealStatus;
  contactId: string;
}

export type UpdateDealDto = Partial<CreateDealDto>;

export interface DealResponse {
  id: string;
  title: string;
  value: number;
  status: DealStatus;
  contact_id: string;
  created_by?: string;
  tenant_id?: string;
  created_at: string;
  updated_at?: string;
  contacts?: ContactRef;
}

export interface DealDetailResponse extends DealResponse {
  tasks?: TaskResponse[];
}
