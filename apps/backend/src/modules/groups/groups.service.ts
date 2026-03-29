import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser, UserRole } from '../../common/types';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { GroupsRepository } from './groups.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

  async findAll(currentUser: AuthenticatedUser, filters: { page?: number; limit?: number } = {}) {
    return this.groupsRepository.findAllScoped(currentUser, filters);
  }

  async findOne(id: string) {
    const group = await this.groupsRepository.findWithMembers(id);
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async create(dto: CreateGroupDto, currentUser: AuthenticatedUser) {
    if (currentUser.role === UserRole.USER) {
      throw new ForbiddenException('Only managers and admins can create groups');
    }
    return this.groupsRepository.create({
      name: dto.name,
      description: dto.description,
      manager_id: dto.managerId,
      created_by: currentUser.id,
    });
  }

  async update(id: string, dto: UpdateGroupDto) {
    return this.groupsRepository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async remove(id: string) {
    await this.groupsRepository.delete(id);
    return { deleted: true };
  }

  async addMember(groupId: string, dto: AddMemberDto) {
    const group = await this.findOne(groupId);
    return this.groupsRepository.addMember(groupId, dto.userId, group.manager_id);
  }

  async removeMember(groupId: string, userId: string) {
    await this.groupsRepository.removeMember(groupId, userId);
    return { deleted: true };
  }
}
