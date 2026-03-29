import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<SupabaseClient> => {
        const url = configService.get<string>('SUPABASE_URL');
        const key = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
        if (!url || !key) {
          throw new Error('Missing Supabase configuration');
        }
        const client = createClient(url, key, {
          auth: { persistSession: false },
        });

        // Verify connection by doing a lightweight query
        const { error } = await client.from('users').select('id').limit(1);
        if (error) {
          console.error('[Supabase] Connection test failed:', error.message);
        } else {
          console.log('[Supabase] Connection successful ✓');
        }

        return client;
      },
    },
  ],
  exports: [SUPABASE_CLIENT],
})
export class SupabaseModule {}
