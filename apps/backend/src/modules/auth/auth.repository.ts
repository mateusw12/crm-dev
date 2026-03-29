import { Injectable, Inject } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { JwtPayload, UserRole } from '../../common/types';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'users');
  }

  async findOrCreateUser(payload: JwtPayload) {
    const existing = await this.findById(payload.sub);
    if (existing) return existing;

    return this.create({
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      role: UserRole.USER,
    });
  }

  async findMe(userId: string) {
    return this.findById(userId);
  }
}
