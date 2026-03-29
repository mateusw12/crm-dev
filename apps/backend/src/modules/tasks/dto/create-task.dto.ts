import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { TaskStatus } from "../../../common/types";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTaskDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({ description: "Task title", example: "Follow up with client" })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: "Detailed description of the task",
    example: "Call the client to discuss project updates.",
  })
  description?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: "Due date for the task",
    example: "2024-12-31T23:59:59Z",
  })
  dueDate?: string;

  @IsEnum(TaskStatus)
  @ApiProperty({
    description: "Current status of the task",
    example: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: "ID of the related contact",
    example: "contact-123",
  })
  contactId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({ description: "ID of the related deal", example: "deal-123" })
  dealId?: string;
}
