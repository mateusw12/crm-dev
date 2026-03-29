import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser, UserRole, DealStatus } from '../../common/types';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { DealsRepository } from './deals.repository';

@Injectable()
export class DealsService {
  constructor(private readonly dealsRepository: DealsRepository) {}

  async findAll(
    currentUser: AuthenticatedUser,
    filters: { status?: DealStatus; contactId?: string },
  ) {
    return this.dealsRepository.findAllFiltered(currentUser, filters);
  }

  async findOne(id: string, currentUser: AuthenticatedUser) {
    const deal = await this.dealsRepository.findWithRelations(id);
    if (!deal) throw new NotFoundException('Deal not found');
    this.checkOwnership(deal, currentUser);
    return deal;
  }

  async create(dto: CreateDealDto, currentUser: AuthenticatedUser) {
    return this.dealsRepository.create({
      title: dto.title,
      value: dto.value ?? 0,
      status: dto.status,
      contact_id: dto.contactId,
      created_by: currentUser.id,
      tenant_id: currentUser.tenantId ?? currentUser.id,
    });
  }

  async update(id: string, dto: UpdateDealDto, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    return this.dealsRepository.update(id, {
      title: dto.title,
      value: dto.value,
      status: dto.status,
      contact_id: dto.contactId,
      updated_at: new Date().toISOString(),
    });
  }

  async remove(id: string, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    await this.dealsRepository.delete(id);
    return { deleted: true };
  }

  private checkOwnership(deal: any, currentUser: AuthenticatedUser) {
    if (currentUser.role === UserRole.ADMIN) return;
    if (
      currentUser.role === UserRole.MANAGER &&
      deal.tenant_id === (currentUser.tenantId ?? currentUser.id)
    )
      return;
    if (deal.created_by === currentUser.id) return;
    throw new ForbiddenException('Access denied');
  }
}
