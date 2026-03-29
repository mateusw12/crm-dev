import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { AuthenticatedUser, UserRole, TaskStatus } from '../../common/types';
import { BaseRepository, PaginatedResult } from '../../common/repositories/base.repository';

@Injectable()
export class TasksRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'tasks');
  }

  async findAllFiltered(
    currentUser: AuthenticatedUser,
    filters: { status?: TaskStatus; contactId?: string; dealId?: string; dueDate?: string; page?: number; limit?: number },
  ): Promise<PaginatedResult<any>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    let query = this.queryPaginated('*, contacts(id, name), deals(id, title)').order('due_date', { ascending: true });

    if (currentUser.role === UserRole.USER) {
      query = query.eq('created_by', currentUser.id);
    } else if (currentUser.role === UserRole.MANAGER) {
      query = query.eq('tenant_id', currentUser.tenantId ?? currentUser.id);
    }

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.contactId) query = query.eq('contact_id', filters.contactId);
    if (filters.dealId) query = query.eq('deal_id', filters.dealId);
    if (filters.dueDate) query = query.lte('due_date', filters.dueDate);

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data ?? [], total: count ?? 0, page, limit };
  }

  async findWithRelations(id: string) {
    return this.findById(id, '*, contacts(id, name), deals(id, title)');
  }
}
