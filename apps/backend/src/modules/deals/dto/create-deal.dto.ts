import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";
import { DealStatus } from "../../../common/types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDealDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: "Deal title",
    example: "Big Sale with Acme Corp",
  })
  title: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: "Deal value in USD",
    example: 10000,
    required: false,
  })
  value?: number;

  @IsEnum(DealStatus)
  @ApiProperty({
    description: "Current status of the deal",
    example: DealStatus.LEAD,
  })
  status: DealStatus;

  @IsUUID()
  @ApiProperty({
    description: "ID of the associated contact",
    example: "contact-123",
  })
  contactId: string;
}
