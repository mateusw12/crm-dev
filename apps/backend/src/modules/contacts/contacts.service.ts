import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AuthenticatedUser, UserRole } from '../../common/types';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactsRepository } from './contacts.repository';

@Injectable()
export class ContactsService {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  async findAll(
    currentUser: AuthenticatedUser,
    filters: { search?: string; companyId?: string; page?: number; limit?: number },
  ) {
    return this.contactsRepository.findAllFiltered(currentUser, filters);
  }

  async findOne(id: string, currentUser: AuthenticatedUser) {
    const contact = await this.contactsRepository.findDetail(id);
    if (!contact) throw new NotFoundException('error.contactNotFound');
    this.checkOwnership(contact, currentUser);
    return contact;
  }

  async create(dto: CreateContactDto, currentUser: AuthenticatedUser) {
    return this.contactsRepository.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company_id: dto.companyId,
      notes: dto.notes,
      created_by: currentUser.id,
      updated_by: currentUser.id,
      tenant_id: currentUser.tenantId ?? currentUser.id,
    });
  }

  async update(id: string, dto: UpdateContactDto, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    return this.contactsRepository.update(id, {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company_id: dto.companyId,
      notes: dto.notes,
      updated_by: currentUser.id,
      updated_at: new Date().toISOString(),
    });
  }

  async remove(id: string, currentUser: AuthenticatedUser) {
    await this.findOne(id, currentUser);
    await this.contactsRepository.delete(id);
    return { deleted: true };
  }

  private checkOwnership(contact: any, currentUser: AuthenticatedUser) {
    if (currentUser.role === UserRole.ADMIN) return;
    if (
      currentUser.role === UserRole.MANAGER &&
      contact.tenant_id === (currentUser.tenantId ?? currentUser.id)
    )
      return;
    if (contact.created_by === currentUser.id) return;
    throw new ForbiddenException('error.accessDenied');
  }
}
