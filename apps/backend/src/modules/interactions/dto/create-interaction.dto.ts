import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { InteractionType } from '../../../common/types';

export class CreateInteractionDto {
  @IsEnum(InteractionType)
  type: InteractionType;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsUUID()
  contactId: string;
}
