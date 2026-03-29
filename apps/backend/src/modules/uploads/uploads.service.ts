import { Injectable } from "@nestjs/common";
import { UploadFileDto } from "./dto/upload-file.dto";
import { StorageService } from "@/supabase/storage.service";

@Injectable()
export class UploadsService {
  constructor(private readonly storage: StorageService) {}

  async uploadFile(file: Express.Multer.File, body: any) {
    const { entityType, entityId, field } = body as UploadFileDto;

    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const path = `${entityType}/${entityId}/${timestamp}_${safeName}`;

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "public";

    await this.storage.uploadFile(bucket, path, file.buffer, file.mimetype);
    const publicUrl = this.storage.getPublicUrl(bucket, path);

    return { publicUrl, path, field };
  }
}
