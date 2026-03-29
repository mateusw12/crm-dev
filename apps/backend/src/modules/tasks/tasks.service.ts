import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser, TaskStatus } from '../../common/types';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async findAll(
    currentUser: AuthenticatedUser,
    filters: { status?: TaskStatus; contactId?: string; dealId?: string; dueDate?: string; page?: number; limit?: number },
  ) {
    return this.tasksRepository.findAllFiltered(currentUser, filters);
  }

  async findOne(id: string) {
    const task = await this.tasksRepository.findWithRelations(id);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(dto: CreateTaskDto, currentUser: AuthenticatedUser) {
    return this.tasksRepository.create({
      title: dto.title,
      description: dto.description,
      due_date: dto.dueDate,
      status: dto.status ?? TaskStatus.PENDING,
      contact_id: dto.contactId,
      deal_id: dto.dealId,
      created_by: currentUser.id,
      tenant_id: currentUser.tenantId ?? currentUser.id,
    });
  }

  async update(id: string, dto: UpdateTaskDto) {
    return this.tasksRepository.update(id, {
      title: dto.title,
      description: dto.description,
      due_date: dto.dueDate,
      status: dto.status,
      contact_id: dto.contactId,
      deal_id: dto.dealId,
      updated_at: new Date().toISOString(),
    });
  }

  async remove(id: string) {
    await this.tasksRepository.delete(id);
    return { deleted: true };
  }
}
