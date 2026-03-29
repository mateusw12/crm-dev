import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from '../../supabase/storage.service';
import { AttachmentsRepository } from './attachments.repository';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly repo: AttachmentsRepository,
    private readonly storage: StorageService,
  ) {}

  async getByEntity(entityType: string, entityId: string) {
    return this.repo.findByEntity(entityType, entityId);
  }

  async save(
    entityType: string,
    entityId: string,
    file: Express.Multer.File,
    uploadedBy: string,
  ) {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'public';
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const path = `${entityType}/${entityId}/${timestamp}_${safeName}`;

    await this.storage.uploadFile(bucket, path, file.buffer, file.mimetype);
    const url = this.storage.getPublicUrl(bucket, path);

    return this.repo.create({
      entity_type: entityType,
      entity_id: entityId,
      url,
      path,
      filename: file.originalname,
      content_type: file.mimetype,
      size: file.size,
      uploaded_by: uploadedBy,
    });
  }

  async remove(id: string): Promise<void> {
    const attachment = await this.repo.findById(id);
    if (!attachment) throw new NotFoundException('Attachment not found');
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'public';
    await this.storage.removeFile(bucket, attachment.path).catch(() => null);
    await this.repo.delete(id);
  }
}
