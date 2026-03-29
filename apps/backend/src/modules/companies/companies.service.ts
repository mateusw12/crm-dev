import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AuthenticatedUser } from '../../common/types';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompaniesRepository } from './companies.repository';
import { BrasilApiService } from '../brasilapi/brasilapi.service';
import { cleanCnpj } from '../../utils';
import { buildCsv } from '../../common/utils/export.util';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly brasilApiService: BrasilApiService,
  ) {}

  async findAll(currentUser: AuthenticatedUser, filters: { search?: string; page?: number; limit?: number }) {
    return this.companiesRepository.findAllFiltered(currentUser, filters);
  }

  async findOne(id: string) {
    const company = await this.companiesRepository.findWithContacts(id);
    if (!company) throw new NotFoundException('error.companyNotFound');
    return company;
  }

  async create(dto: CreateCompanyDto, currentUser: AuthenticatedUser) {
    const tenantId = currentUser.tenantId ?? currentUser.id;
    const cnpjDigits = cleanCnpj(dto.cnpj);

    const existing = await this.companiesRepository.findByCnpjInTenant(cnpjDigits, tenantId);
    if (existing) {
      throw new ConflictException('error.cnpjDuplicate');
    }

    const { logoUrl, ...rest } = dto;
    return this.companiesRepository.create({
      ...rest,
      cnpj: cnpjDigits,
      ...(logoUrl ? { logo_url: logoUrl } : {}),
      created_by: currentUser.id,
      tenant_id: tenantId,
    });
  }

  async update(id: string, dto: UpdateCompanyDto, currentUser: AuthenticatedUser) {
    if (dto.cnpj) {
      const company = await this.companiesRepository.findWithContacts(id);
      if (!company) throw new NotFoundException('error.companyNotFound');

      const tenantId = company.tenant_id ?? currentUser.tenantId ?? currentUser.id;
      const cnpjDigits = cleanCnpj(dto.cnpj);

      const existing = await this.companiesRepository.findByCnpjInTenant(cnpjDigits, tenantId, id);
      if (existing) {
        throw new ConflictException('error.cnpjDuplicate');
      }

      const { logoUrl: logoUrl1, ...rest1 } = dto;
      return this.companiesRepository.update(id, {
        ...rest1,
        cnpj: cnpjDigits,
        ...(logoUrl1 ? { logo_url: logoUrl1 } : {}),
        updated_at: new Date().toISOString(),
      });
    }

    const { logoUrl, ...rest } = dto;
    return this.companiesRepository.update(id, {
      ...rest,
      ...(logoUrl ? { logo_url: logoUrl } : {}),
      updated_at: new Date().toISOString(),
    });
  }

  async remove(id: string) {
    await this.companiesRepository.delete(id);
    return { deleted: true };
  }

  async lookupCep(cep: string) {
    return this.brasilApiService.lookupCep(cep);
  }

  async lookupCnpj(cnpj: string) {
    return this.brasilApiService.lookupCnpj(cnpj);
  }

  async exportAll(currentUser: AuthenticatedUser): Promise<Buffer> {
    const data = await this.companiesRepository.findAllForExport(currentUser);
    return buildCsv(data, [
      { header: 'Name', key: 'name' },
      { header: 'CNPJ', key: 'cnpj' },
      { header: 'Industry', key: 'industry' },
      { header: 'Phone', key: 'phone' },
      { header: 'Website', key: 'website' },
      { header: 'Notes', key: 'notes' },
      { header: 'Created At', key: 'created_at' },
    ]);
  }
}
