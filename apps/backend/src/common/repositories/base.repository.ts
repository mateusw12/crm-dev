import { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepository<T = any> {
  constructor(
    protected readonly supabase: SupabaseClient,
    protected readonly table: string,
  ) {}

  protected query(select = '*') {
    return this.supabase.from(this.table).select(select);
  }

  async findById(id: string, select = '*'): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select(select)
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data as T;
  }

  async create(data: Record<string, any>, select = '*'): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(this.table)
      .insert(data)
      .select(select)
      .single();
    if (error) throw error;
    return result as T;
  }

  async update(id: string, data: Record<string, any>, select = '*'): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(this.table)
      .update(data)
      .eq('id', id)
      .select(select)
      .single();
    if (error) throw error;
    return result as T;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }
}
