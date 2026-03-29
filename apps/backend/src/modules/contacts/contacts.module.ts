import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactsRepository } from './contacts.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ContactsController],
  providers: [ContactsRepository, ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
