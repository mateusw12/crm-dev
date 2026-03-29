import { Injectable } from '@nestjs/common';
import { AuthenticatedUser, DealStatus, TaskStatus } from '../../common/types';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getKpis(currentUser: AuthenticatedUser) {
    const { contacts, deals, tasks, wonDeals, lostDeals } =
      await this.dashboardRepository.getKpiData(currentUser);

    const allDeals = deals.data ?? [];
    const totalPipelineValue = allDeals.reduce((sum, d) => sum + (d.value ?? 0), 0);
    const wonValue = (wonDeals.data ?? []).reduce((sum, d) => sum + (d.value ?? 0), 0);

    const openDeals = allDeals.filter(
      (d) => ![DealStatus.WON, DealStatus.LOST].includes(d.status),
    ).length;

    const allTasks = tasks.data ?? [];
    const overdueTasks = allTasks.filter(
      (t) =>
        t.status === TaskStatus.PENDING &&
        t.due_date &&
        new Date(t.due_date) < new Date(),
    ).length;

    const dealsByStatus = Object.values(DealStatus).map((status) => ({
      status,
      count: allDeals.filter((d) => d.status === status).length,
      value: allDeals
        .filter((d) => d.status === status)
        .reduce((sum, d) => sum + (d.value ?? 0), 0),
    }));

    const total = (wonDeals.data?.length ?? 0) + (lostDeals.data?.length ?? 0);
    const conversionRate = total > 0 ? ((wonDeals.data?.length ?? 0) / total) * 100 : 0;

    return {
      totalContacts: contacts.count ?? 0,
      totalDeals: allDeals.length,
      openDeals,
      totalPipelineValue,
      wonValue,
      conversionRate: Math.round(conversionRate * 100) / 100,
      overdueTasks,
      dealsByStatus,
    };
  }
}
