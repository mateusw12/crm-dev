import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';

export interface Attachment {
  id: string;
  entity_type: string;
  entity_id: string;
  url: string;
  path: string;
  filename: string;
  content_type?: string;
  size?: number;
  uploaded_by?: string;
  created_at: string;
}

@Injectable()
export class AttachmentsRepository {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  async findByEntity(entityType: string, entityId: string): Promise<Attachment[]> {
    const { data, error } = await this.supabase
      .from('attachments')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Attachment[];
  }

  async create(payload: Omit<Attachment, 'id' | 'created_at'>): Promise<Attachment> {
    const { data, error } = await this.supabase
      .from('attachments')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as Attachment;
  }

  async findById(id: string): Promise<Attachment | null> {
    const { data, error } = await this.supabase
      .from('attachments')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Attachment;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('attachments').delete().eq('id', id);
    if (error) throw error;
  }
}
