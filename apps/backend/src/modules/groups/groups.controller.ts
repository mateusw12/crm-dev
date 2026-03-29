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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser, UserRole } from '../../common/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  findAll(
    @User() user: AuthenticatedUser,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.groupsService.findAll(user, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group details by ID' })
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  create(@Body() dto: CreateGroupDto, @User() user: AuthenticatedUser) {
    return this.groupsService.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update group details by ID' })
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group by ID' })
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add a member to the group' })
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.groupsService.addMember(id, dto);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a member from the group' })
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  removeMember(@Param('id') id: string, @Param('userId') userId: string) {
    return this.groupsService.removeMember(id, userId);
  }
}
