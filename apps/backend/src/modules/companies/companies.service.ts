import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../../common/types';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesRepository } from './companies.repository';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async findAll(currentUser: AuthenticatedUser, search?: string) {
    return this.companiesRepository.findAllFiltered(currentUser, search);
  }

  async findOne(id: string) {
    const company = await this.companiesRepository.findWithContacts(id);
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async create(dto: CreateCompanyDto, currentUser: AuthenticatedUser) {
    return this.companiesRepository.create({
      ...dto,
      created_by: currentUser.id,
      tenant_id: currentUser.tenantId ?? currentUser.id,
    });
  }

  async update(id: string, dto: UpdateCompanyDto) {
    return this.companiesRepository.update(id, {
      ...dto,
      updated_at: new Date().toISOString(),
    });
  }

  async remove(id: string) {
    await this.companiesRepository.delete(id);
    return { deleted: true };
  }
}
