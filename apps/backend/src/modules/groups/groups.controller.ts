import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser, UserRole } from '../../common/types';

@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  findAll(@User() user: AuthenticatedUser) {
    return this.groupsService.findAll(user);
  }

  @Get(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  create(@Body() dto: CreateGroupDto, @User() user: AuthenticatedUser) {
    return this.groupsService.create(dto, user);
  }

  @Put(':id')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }

  @Post(':id/members')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.groupsService.addMember(id, dto);
  }

  @Delete(':id/members/:userId')
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.groupsService.removeMember(id, userId);
  }
}
