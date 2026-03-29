import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class InteractionsRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'interactions');
  }

  async findByContact(contactId: string) {
    const { data, error } = await this.query()
      .eq('contact_id', contactId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }
}
