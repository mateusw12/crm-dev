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
import { DealsService } from './deals.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser, DealStatus } from '../../common/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Deals")
@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all deals with optional filters' })
  findAll(
    @User() user: AuthenticatedUser,
    @Query('status') status?: DealStatus,
    @Query('contactId') contactId?: string,
  ) {
    return this.dealsService.findAll(user, { status, contactId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal details by ID' })
  findOne(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.dealsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new deal' })
  create(@Body() dto: CreateDealDto, @User() user: AuthenticatedUser) {
    return this.dealsService.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update deal details by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDealDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.dealsService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete deal by ID' })
  remove(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.dealsService.remove(id, user);
  }
}
