import { DealStatus } from './enums';

export interface DealsByStatusItem {
  status: DealStatus;
  count: number;
  value: number;
}

export interface DashboardKpisResponse {
  totalContacts: number;
  totalDeals: number;
  openDeals: number;
  totalPipelineValue: number;
  wonValue: number;
  conversionRate: number;
  overdueTasks: number;
  dealsByStatus: DealsByStatusItem[];
}
