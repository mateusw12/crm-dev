import { UserRole } from './enums';

export interface UpdateUserDto {
  name?: string;
  picture?: string;
  role?: UserRole;
  managerId?: string;
  tenantId?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  role: UserRole;
  manager_id?: string;
  tenant_id?: string;
  created_at: string;
  updated_at?: string;
}
