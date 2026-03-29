import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Interactions')
@Controller('interactions')
@UseGuards(JwtAuthGuard)
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all interactions for a specific contact' })
  findByContact(@Query('contactId') contactId: string) {
    return this.interactionsService.findByContact(contactId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get interaction details by ID' })
  findOne(@Param('id') id: string) {
    return this.interactionsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new interaction' })
  create(@Body() dto: CreateInteractionDto, @User() user: AuthenticatedUser) {
    return this.interactionsService.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update interaction details by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateInteractionDto) {
    return this.interactionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete interaction by ID' })
  remove(@Param('id') id: string) {
    return this.interactionsService.remove(id);
  }
}
