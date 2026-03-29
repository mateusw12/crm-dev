import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class NotificationsRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'notifications');
  }

  async findByUser(userId: string) {
    const { data, error } = await this.query()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data;
  }

  async markRead(id: string) {
    return this.update(id, { read: true, updated_at: new Date().toISOString() });
  }

  async markAllRead(userId: string) {
    const { error } = await this.supabase
      .from(this.table)
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    if (error) throw error;
  }
}
