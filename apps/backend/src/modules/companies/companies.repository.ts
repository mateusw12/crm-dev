import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { AuthenticatedUser, UserRole } from '../../common/types';
import { BaseRepository, PaginatedResult } from '../../common/repositories/base.repository';

@Injectable()
export class CompaniesRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'companies');
  }

  async findAllFiltered(
    currentUser: AuthenticatedUser,
    filters: { search?: string; page?: number; limit?: number },
  ): Promise<PaginatedResult<any>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    let query = this.queryPaginated('*, contacts(id, name, email)').order('created_at', { ascending: false });

    if (currentUser.role === UserRole.USER) {
      query = query.eq('created_by', currentUser.id);
    } else if (currentUser.role === UserRole.MANAGER) {
      query = query.eq('tenant_id', currentUser.tenantId ?? currentUser.id);
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data ?? [], total: count ?? 0, page, limit };
  }

  async findWithContacts(id: string) {
    return this.findById(id, '*, contacts(*)');
  }
}
