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
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';

@Controller('contacts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll(
    @User() user: AuthenticatedUser,
    @Query('search') search?: string,
    @Query('companyId') companyId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.contactsService.findAll(user, { search, companyId, page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.contactsService.findOne(id, user);
  }

  @Post()
  create(@Body() dto: CreateContactDto, @User() user: AuthenticatedUser) {
    return this.contactsService.create(dto, user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.contactsService.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.contactsService.remove(id, user);
  }
}
