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

@Controller('deals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  findAll(
    @User() user: AuthenticatedUser,
    @Query('status') status?: DealStatus,
    @Query('contactId') contactId?: string,
  ) {
    return this.dealsService.findAll(user, { status, contactId });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.dealsService.findOne(id, user);
  }

  @Post()
  create(@Body() dto: CreateDealDto, @User() user: AuthenticatedUser) {
    return this.dealsService.create(dto, user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDealDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.dealsService.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.dealsService.remove(id, user);
  }
}
