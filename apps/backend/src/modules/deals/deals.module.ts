import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { DealsRepository } from './deals.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DealsController],
  providers: [DealsRepository, DealsService],
  exports: [DealsService],
})
export class DealsModule {}
