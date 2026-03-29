import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { AuthenticatedUser, UserRole, DealStatus } from '../../common/types';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class DealsRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'deals');
  }

  async findAllFiltered(
    currentUser: AuthenticatedUser,
    filters: { status?: DealStatus; contactId?: string },
  ) {
    let query = this.query('*, contacts(id, name, email)').order('created_at', { ascending: false });

    if (currentUser.role === UserRole.USER) {
      query = query.eq('created_by', currentUser.id);
    } else if (currentUser.role === UserRole.MANAGER) {
      query = query.eq('tenant_id', currentUser.tenantId ?? currentUser.id);
    }

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.contactId) query = query.eq('contact_id', filters.contactId);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findWithRelations(id: string) {
    return this.findById(id, '*, contacts(id, name), tasks(*)');
  }
}
