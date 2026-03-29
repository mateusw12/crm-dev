import { http } from '../api';
import type {
  CreateContactDto,
  UpdateContactDto,
  ContactResponse,
  ContactDetailResponse,
  ContactListResponse,
  DeletedResponse,
  GetContactsParams,
} from '../dto';

const API_BASE = '/contacts';

export class ContactsService {
  static async getAll(params?: GetContactsParams) {
    return http.get<ContactListResponse>(API_BASE, { params });
  }

  static async getById(id: string) {
    return http.get<ContactDetailResponse>(`${API_BASE}/${id}`);
  }

  static async create(data: CreateContactDto) {
    return http.post<ContactResponse>(API_BASE, data);
  }

  static async update(id: string, data: UpdateContactDto) {
    return http.put<ContactResponse>(`${API_BASE}/${id}`, data);
  }

  static async delete(id: string) {
    return http.delete<DeletedResponse>(`${API_BASE}/${id}`);
  }
}
