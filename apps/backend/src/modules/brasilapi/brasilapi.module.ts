import { Module } from '@nestjs/common';
import { BrasilApiService } from './brasilapi.service';

@Module({
  providers: [BrasilApiService],
  exports: [BrasilApiService],
})
export class BrasilApiModule {}
