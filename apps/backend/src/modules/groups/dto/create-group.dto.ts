import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateGroupDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: "Group name", example: "Sales Team" })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "Detailed description of the group",
    example: "This group is responsible for all sales-related activities.",
    required: false,
  })
  description?: string;

  @IsString()
  @ApiProperty({
    description: "ID of the manager who owns this group",
    example: "manager-123",
  })
  managerId: string;
}
