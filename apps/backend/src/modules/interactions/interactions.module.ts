import { Module } from '@nestjs/common';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';
import { InteractionsRepository } from './interactions.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [InteractionsController],
  providers: [InteractionsRepository, InteractionsService],
})
export class InteractionsModule {}
