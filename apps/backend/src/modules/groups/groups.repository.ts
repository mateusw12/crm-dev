import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { AuthenticatedUser, UserRole } from '../../common/types';
import { BaseRepository, PaginatedResult } from '../../common/repositories/base.repository';

@Injectable()
export class GroupsRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'groups');
  }

  async findAllScoped(
    currentUser: AuthenticatedUser,
    filters: { page?: number; limit?: number } = {},
  ): Promise<PaginatedResult<any>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    let query = this.queryPaginated('*, group_members(user_id, users(id, name, email))').order('created_at', {
      ascending: false,
    });

    if (currentUser.role === UserRole.MANAGER) {
      query = query.eq('manager_id', currentUser.id);
    }

    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data ?? [], total: count ?? 0, page, limit };
  }

  async findWithMembers(id: string) {
    return this.findById(id, '*, group_members(user_id, users(id, name, email))');
  }

  async addMember(groupId: string, userId: string, managerId: string) {
    const { data, error } = await this.supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: userId })
      .select()
      .single();
    if (error) throw error;

    await this.supabase
      .from('users')
      .update({ manager_id: managerId })
      .eq('id', userId);

    return data;
  }

  async removeMember(groupId: string, userId: string) {
    const { error } = await this.supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    if (error) throw error;
  }
}
