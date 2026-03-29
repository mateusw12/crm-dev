import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UploadFileDto } from "./dto/upload-file.dto";
import { UploadsService } from "./uploads.service";

@Controller("uploads")
@UseGuards(JwtAuthGuard)
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileDto,
  ) {
    if (!file) throw new BadRequestException("No file uploaded");

    const { publicUrl, path, field } = await this.uploadsService.uploadFile(
      file,
      body,
    );

    return {
      url: publicUrl,
      path,
      field: field || null,
      originalName: file.originalname,
      contentType: file.mimetype,
      size: file.size,
    };
  }
}
