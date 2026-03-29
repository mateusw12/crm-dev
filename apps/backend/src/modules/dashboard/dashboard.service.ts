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

  async getReports(currentUser: AuthenticatedUser, from: string, to: string) {
    const deals = await this.dashboardRepository.getReportData(currentUser, from, to);

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
