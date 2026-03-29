import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddMemberDto {
  @IsString()
  @ApiProperty({
    description: "ID of the user to be added to the group",
    example: "user-123",
  })
  userId: string;
}
