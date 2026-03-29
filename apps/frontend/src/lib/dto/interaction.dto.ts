import { InteractionType } from './enums';

export interface CreateInteractionDto {
  type: InteractionType;
  description: string;
  date: string;
  contactId: string;
}

export type UpdateInteractionDto = Partial<CreateInteractionDto>;

export interface InteractionResponse {
  id: string;
  type: InteractionType;
  description: string;
  date: string;
  contact_id: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}
