import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { AuthenticatedUser, UserRole, DealStatus } from "../../common/types";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";
import { DealsRepository } from "./deals.repository";
import { buildCsv } from "../../common/utils/export.util";

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
    if (!deal) throw new NotFoundException("error.dealNotFound");
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
    throw new ForbiddenException("error.accessDenied");
  }

  async exportAll(currentUser: AuthenticatedUser): Promise<Buffer> {
    const data = await this.dealsRepository.findAllForExport(currentUser);
    return buildCsv(data, [
      { header: "Title", key: "title" },
      { header: "Status", key: "status" },
      { header: "Value", key: "value" },
      { header: "Contact", key: "contact" },
      { header: "Created At", key: "created_at" },
    ]);
  }

  async getReports(currentUser: AuthenticatedUser, from: string, to: string) {
    const deals: Array<{
      id: string;
      title: string;
      value: number;
      status: DealStatus;
      created_at: string;
    }> = await this.dealsRepository.findByPeriod(currentUser, from, to);

    const won = deals.filter((d) => d.status === DealStatus.WON);
    const lost = deals.filter((d) => d.status === DealStatus.LOST);
    const open = deals.filter(
      (d) => d.status !== DealStatus.WON && d.status !== DealStatus.LOST,
    );

    const sum = (arr: any[]) => arr.reduce((acc, d) => acc + (d.value ?? 0), 0);

    const dealsByStatus = Object.values(DealStatus).map((status) => ({
      status,
      count: deals.filter((d) => d.status === status).length,
      value: sum(deals.filter((d) => d.status === status)),
    }));

    return {
      period: { from, to },
      total: { count: deals.length, value: sum(deals) },
      won: { count: won.length, value: sum(won) },
      lost: { count: lost.length, value: sum(lost) },
      open: { count: open.length, value: sum(open) },
      dealsByStatus,
    };
  }
}
