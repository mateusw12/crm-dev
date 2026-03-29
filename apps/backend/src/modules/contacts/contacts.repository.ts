import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { AuthenticatedUser, UserRole } from '../../common/types';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class ContactsRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'contacts');
  }

  async findAllFiltered(
    currentUser: AuthenticatedUser,
    filters: { search?: string; companyId?: string; page?: number; limit?: number },
  ) {
    let query = this.query('*, companies(id, name)').order('created_at', { ascending: false });

    if (currentUser.role === UserRole.USER) {
      query = query.eq('created_by', currentUser.id);
    } else if (currentUser.role === UserRole.MANAGER) {
      query = query.eq('tenant_id', currentUser.tenantId ?? currentUser.id);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters.companyId) {
      query = query.eq('company_id', filters.companyId);
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count, page, limit };
  }

  async findDetail(id: string) {
    return this.findById(id, '*, companies(id, name), interactions(*), deals(*), tasks(*)');
  }
}
