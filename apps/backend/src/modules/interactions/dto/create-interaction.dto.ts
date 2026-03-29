import { IsDateString, IsEnum, IsString, IsUUID } from "class-validator";
import { InteractionType } from "../../../common/types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateInteractionDto {
  @IsEnum(InteractionType)
  @ApiProperty({
    description: "Type of interaction",
    enum: InteractionType,
    example: InteractionType.CALL,
  })
  type: InteractionType;

  @IsString()
  @ApiProperty({
    description: "Detailed description of the interaction",
    example: "Had a 30-minute call to discuss project requirements.",
  })
  description: string;

  @IsDateString()
  @ApiProperty({
    description: "Date and time when the interaction occurred",
    example: "2024-06-01T14:30:00Z",
  })
  date: string;

  @IsUUID()
  @ApiProperty({
    description: "ID of the contact associated with this interaction",
    example: "contact-123",
  })
  contactId: string;
}
