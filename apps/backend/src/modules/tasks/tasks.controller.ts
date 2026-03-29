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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser, TaskStatus } from '../../common/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks with optional filters' })
  findAll(
    @User() user: AuthenticatedUser,
    @Query('status') status?: TaskStatus,
    @Query('contactId') contactId?: string,
    @Query('dealId') dealId?: string,
    @Query('dueDate') dueDate?: string,
  ) {
    return this.tasksService.findAll(user, { status, contactId, dealId, dueDate });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task details by ID' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() dto: CreateTaskDto, @User() user: AuthenticatedUser) {
    return this.tasksService.create(dto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task details by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by ID' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
