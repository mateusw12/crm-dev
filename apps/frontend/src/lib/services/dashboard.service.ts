import { http } from '../api';
import type { DashboardKpisResponse, DashboardReportsResponse } from '../dto';

const API_BASE = '/dashboard';

export class DashboardService {
  static async kpis() {
    return http.get<DashboardKpisResponse>(`${API_BASE}/kpis`);
  }

  static async reports(from: string, to: string) {
    return http.get<DashboardReportsResponse>(`${API_BASE}/reports`, {
      params: { from, to },
    });
  }
}
