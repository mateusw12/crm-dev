import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CompaniesRepository } from './companies.repository';
import { BrasilApiModule } from '../brasilapi/brasilapi.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, BrasilApiModule],
  controllers: [CompaniesController],
  providers: [CompaniesRepository, CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
