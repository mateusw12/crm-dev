import { Injectable, Inject } from '@nestjs/common';
import { createHash } from 'crypto';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../supabase/supabase.module';
import { JwtPayload, UserRole } from '../../common/types';
import { BaseRepository } from '../../common/repositories/base.repository';

// URL namespace for UUID v5 (RFC 4122)
const UUID_NAMESPACE = Buffer.from('6ba7b8119dad11d180b400c04fd430c8', 'hex');

/** Converts any OAuth sub string into a deterministic UUID v5. */
function subToUuid(sub: string): string {
  const hash = createHash('sha1')
    .update(UUID_NAMESPACE)
    .update(Buffer.from(sub, 'utf8'))
    .digest();
  hash[6] = (hash[6] & 0x0f) | 0x50; // version 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // variant bits
  const h = hash.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(@Inject(SUPABASE_CLIENT) supabase: SupabaseClient) {
    super(supabase, 'users');
  }

  async findOrCreateUser(payload: JwtPayload) {
    const id = subToUuid(payload.sub);
    const existing = await this.findById(id);
    if (existing) return existing;

    const result = await this.create({
      id,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      role: UserRole.USER,
    });
    return result;
  }

  async findMe(userId: string) {
    return this.findById(userId);
  }
}
