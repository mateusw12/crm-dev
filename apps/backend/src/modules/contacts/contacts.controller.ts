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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Contacts")
@Controller('contacts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contacts with optional filters' })
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
  @ApiOperation({ summary: 'Get contact details by ID' })
  findOne(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.contactsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  create(@Body() dto: CreateContactDto, @User() user: AuthenticatedUser) {
    return this.contactsService.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update contact details by ID' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.contactsService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact by ID' })
  remove(@Param('id') id: string, @User() user: AuthenticatedUser) {
    return this.contactsService.remove(id, user);
  }
}
