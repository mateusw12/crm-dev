import httpClient from '../api/http-client';

export interface UploadResult {
  url: string;
  path: string;
  field: string | null;
  originalName: string;
  contentType: string;
  size: number;
}

export class UploadsService {
  static async upload(
    file: File,
    entityType: string,
    entityId: string,
    field?: string,
  ): Promise<UploadResult> {
    const form = new FormData();
    form.append('file', file);
    form.append('entityType', entityType);
    form.append('entityId', entityId);
    if (field) form.append('field', field);

    const res = await httpClient.post<UploadResult>('/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
}
