import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateContactDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: "Contact name", example: "John Doe" })
  name: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: "Contact email address",
    example: "john.doe@example.com",
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "Contact phone number",
    example: "(11) 1234-5678",
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "ID of the company this contact belongs to",
    example: "company-123",
  })
  companyId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ApiProperty({
    description: "Additional notes about the contact",
    example: "Met at the conference, interested in our product",
  })
  notes?: string;
}
