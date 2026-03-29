import { Module } from '@nestjs/common';
import { SupabaseModule } from '../../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';
import { AttachmentsRepository } from './attachments.repository';
import { AttachmentsService } from './attachments.service';
import { AttachmentsController } from './attachments.controller';
import { StorageService } from '../../supabase/storage.service';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [AttachmentsController],
  providers: [AttachmentsRepository, AttachmentsService, StorageService],
})
export class AttachmentsModule {}
