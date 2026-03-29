import httpClient from '../api/http-client';

export interface AttachmentItem {
  id: string;
  entity_type: string;
  entity_id: string;
  url: string;
  path: string;
  filename: string;
  content_type?: string;
  size?: number;
  uploaded_by?: string;
  created_at: string;
}

export class AttachmentsService {
  static async getByEntity(entityType: string, entityId: string): Promise<AttachmentItem[]> {
    const res = await httpClient.get<AttachmentItem[]>('/attachments', {
      params: { entityType, entityId },
    });
    return res.data;
  }

  static async upload(
    file: File,
    entityType: string,
    entityId: string,
  ): Promise<AttachmentItem> {
    const form = new FormData();
    form.append('file', file);

    const res = await httpClient.post<AttachmentItem>(
      `/attachments/upload?entityType=${encodeURIComponent(entityType)}&entityId=${encodeURIComponent(entityId)}`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return res.data;
  }

  static async remove(id: string): Promise<void> {
    await httpClient.delete(`/attachments/${id}`);
  }
}
