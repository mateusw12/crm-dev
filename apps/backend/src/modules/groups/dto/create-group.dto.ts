import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  managerId: string;
}
