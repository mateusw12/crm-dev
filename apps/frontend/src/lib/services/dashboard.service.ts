import { http } from '../api';
import type { DashboardKpisResponse } from '../dto';

const API_BASE = '/dashboard';

export class DashboardService {
  static async kpis() {
    return http.get<DashboardKpisResponse>(`${API_BASE}/kpis`);
  }
}
