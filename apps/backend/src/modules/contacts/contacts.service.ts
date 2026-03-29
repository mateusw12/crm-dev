import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AuthenticatedUser, UserRole } from '../../common/types';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ImportContactRowDto } from './dto/import-contact-row.dto';
import { ContactsRepository } from './contacts.repository';
import { buildCsv } from '../../common/utils/export.util';

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

  async exportAll(currentUser: AuthenticatedUser): Promise<Buffer> {
    const data = await this.contactsRepository.findAllForExport(currentUser);
    return buildCsv(data, [
      { header: 'Name', key: 'name' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Company', key: 'company' },
      { header: 'Notes', key: 'notes' },
      { header: 'Created At', key: 'created_at' },
    ]);
  }

  async previewImport(rows: any[], currentUser: AuthenticatedUser) {
    const results = await Promise.all(
      rows.map(async (row, index) => {
        const dto = plainToInstance(ImportContactRowDto, row);
        const errors = await validate(dto);
        return {
          row: index + 2, // 1-based, row 1 is header
          data: row,
          errors: errors.map((e) => ({
            field: e.property,
            messages: Object.values(e.constraints ?? {}),
          })),
        };
      }),
    );

    return {
      total: rows.length,
      validCount: results.filter((r) => r.errors.length === 0).length,
      invalidCount: results.filter((r) => r.errors.length > 0).length,
      rows: results,
    };
  }

  async confirmImport(rows: ImportContactRowDto[], currentUser: AuthenticatedUser) {
    const tenantId = currentUser.tenantId ?? currentUser.id;
    let created = 0;
    const errors: { row: number; message: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        await this.contactsRepository.create({
          name: rows[i].name,
          email: rows[i].email,
          phone: rows[i].phone,
          company_id: rows[i].companyId,
          notes: rows[i].notes,
          created_by: currentUser.id,
          updated_by: currentUser.id,
          tenant_id: tenantId,
        });
        created++;
      } catch {
        errors.push({ row: i + 2, message: 'Failed to save row' });
      }
    }

    return { created, errors };
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
