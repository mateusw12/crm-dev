import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../../common/types";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: "User's full name", example: "John Doe" })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "URL of the user's profile picture",
    example: "https://example.com/profile.jpg",
  })
  picture?: string;

  @IsOptional()
  @IsEnum(UserRole)
  @ApiProperty({
    description: "User's role in the system",
    example: UserRole.USER,
    enum: UserRole,
  })
  role?: UserRole;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "ID of the manager this user reports to (if applicable)",
    example: "manager-123",
  })
  managerId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "ID of the tenant this user belongs to (if applicable)",
    example: "tenant-123",
  })
  tenantId?: string;
}
