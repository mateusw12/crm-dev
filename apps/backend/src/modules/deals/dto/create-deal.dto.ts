import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { DealStatus } from '../../../common/types';

export class CreateDealDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

  @IsEnum(DealStatus)
  status: DealStatus;

  @IsUUID()
  contactId: string;
}
