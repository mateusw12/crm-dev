import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthenticatedUser, UserRole } from '../../common/types';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(currentUser: AuthenticatedUser) {
    if (currentUser.role === UserRole.ADMIN) {
      return this.usersRepository.findAll();
    }
    if (currentUser.role === UserRole.MANAGER) {
      return this.usersRepository.findByManager(currentUser.id);
    }
    return this.findOne(currentUser.id, currentUser);
  }

  async findOne(id: string, currentUser: AuthenticatedUser) {
    this.checkAccess(id, currentUser);
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUser: AuthenticatedUser) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('Cannot update other users');
    }
    return this.usersRepository.update(id, { ...dto, updated_at: new Date().toISOString() });
  }

  async remove(id: string, currentUser: AuthenticatedUser) {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete users');
    }
    await this.usersRepository.delete(id);
    return { deleted: true };
  }

  private checkAccess(id: string, currentUser: AuthenticatedUser) {
    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser.role !== UserRole.MANAGER &&
      currentUser.id !== id
    ) {
      throw new ForbiddenException('Access denied');
    }
  }
}
