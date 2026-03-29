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

export interface DashboardReportsResponse {
  period: { from: string; to: string };
  total: { count: number; value: number };
  won: { count: number; value: number };
  lost: { count: number; value: number };
  open: { count: number; value: number };
  dealsByStatus: DealsByStatusItem[];
}
