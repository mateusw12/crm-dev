import type { UserRef } from './refs';

export interface GetGroupsParams {
  page?: number;
  limit?: number;
}

export interface GroupListResponse {
  data: GroupResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  managerId: string;
}

export type UpdateGroupDto = Partial<CreateGroupDto>;

export interface AddMemberDto {
  userId: string;
}

export interface GroupMemberResponse {
  user_id: string;
  users: UserRef;
}

export interface GroupResponse {
  id: string;
  name: string;
  description?: string;
  manager_id: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  group_members?: GroupMemberResponse[];
}

export type GroupDetailResponse = GroupResponse;
