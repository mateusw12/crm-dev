import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { AuthenticatedUser, UserRole, TaskStatus } from '../../common/types';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class TasksRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'tasks');
  }

  async findAllFiltered(
    currentUser: AuthenticatedUser,
    filters: { status?: TaskStatus; contactId?: string; dealId?: string; dueDate?: string },
  ) {
    let query = this.query('*, contacts(id, name), deals(id, title)').order('due_date', { ascending: true });

    if (currentUser.role === UserRole.USER) {
      query = query.eq('created_by', currentUser.id);
    } else if (currentUser.role === UserRole.MANAGER) {
      query = query.eq('tenant_id', currentUser.tenantId ?? currentUser.id);
    }

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.contactId) query = query.eq('contact_id', filters.contactId);
    if (filters.dealId) query = query.eq('deal_id', filters.dealId);
    if (filters.dueDate) query = query.lte('due_date', filters.dueDate);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findWithRelations(id: string) {
    return this.findById(id, '*, contacts(id, name), deals(id, title)');
  }
}
