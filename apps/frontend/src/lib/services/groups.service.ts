import { http } from '../api';
import type {
  CreateGroupDto,
  UpdateGroupDto,
  GroupResponse,
  GroupListResponse,
  GroupDetailResponse,
  GroupMemberResponse,
  GetGroupsParams,
  DeletedResponse,
} from '../dto';

const API_BASE = '/groups';

export class GroupsService {
  static async getAll(params?: GetGroupsParams) {
    return http.get<GroupListResponse>(API_BASE, { params });
  }

  static async getById(id: string) {
    return http.get<GroupDetailResponse>(`${API_BASE}/${id}`);
  }

  static async create(data: CreateGroupDto) {
    return http.post<GroupResponse>(API_BASE, data);
  }

  static async update(id: string, data: UpdateGroupDto) {
    return http.put<GroupResponse>(`${API_BASE}/${id}`, data);
  }

  static async delete(id: string) {
    return http.delete<DeletedResponse>(`${API_BASE}/${id}`);
  }

  static async addMember(groupId: string, userId: string) {
    return http.post<GroupMemberResponse>(`${API_BASE}/${groupId}/members`, { userId });
  }

  static async removeMember(groupId: string, userId: string) {
    return http.delete<DeletedResponse>(`${API_BASE}/${groupId}/members/${userId}`);
  }
}
