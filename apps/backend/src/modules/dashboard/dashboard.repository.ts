import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { AuthenticatedUser, UserRole, DealStatus } from '../../common/types';

@Injectable()
export class DashboardRepository {
  constructor(@Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient) {}

  private getTenantFilter(currentUser: AuthenticatedUser): Record<string, string> {
    if (currentUser.role === UserRole.ADMIN) return {};
    if (currentUser.role === UserRole.MANAGER) {
      return { tenant_id: currentUser.tenantId ?? currentUser.id };
    }
    return { created_by: currentUser.id };
  }

  async getKpiData(currentUser: AuthenticatedUser) {
    const tenantFilter = this.getTenantFilter(currentUser);

    const [contacts, deals, tasks, wonDeals, lostDeals] = await Promise.all([
      this.supabase.from('contacts').select('id', { count: 'exact' }).match(tenantFilter),
      this.supabase.from('deals').select('id, value, status', { count: 'exact' }).match(tenantFilter),
      this.supabase.from('tasks').select('id, status, due_date').match(tenantFilter),
      this.supabase.from('deals').select('id, value').match(tenantFilter).eq('status', DealStatus.WON),
      this.supabase.from('deals').select('id').match(tenantFilter).eq('status', DealStatus.LOST),
    ]);

    return { contacts, deals, tasks, wonDeals, lostDeals };
  }

  async getReportData(currentUser: AuthenticatedUser, from: string, to: string) {
    const tenantFilter = this.getTenantFilter(currentUser);
    const { data, error } = await this.supabase
      .from('deals')
      .select('id, value, status, created_at')
      .match(tenantFilter)
      .gte('created_at', from)
      .lte('created_at', to)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
}
