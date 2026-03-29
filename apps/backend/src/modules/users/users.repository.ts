import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'users');
  }

  async findAll() {
    const { data, error } = await this.query().order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async findByManager(managerId: string) {
    const { data, error } = await this.query().eq('manager_id', managerId);
    if (error) throw error;
    return data;
  }
}
