import { Module } from "@nestjs/common";
import { SupabaseModule } from "../../supabase/supabase.module";
import { AuthModule } from "../auth/auth.module";
import { UploadsController } from "./uploads.controller";
import { StorageService } from "../../supabase/storage.service";
import { UploadsService } from "./uploads.service";

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [UploadsController],
  providers: [StorageService, UploadsService],
  exports: [StorageService, UploadsService],
})
export class UploadsModule {}
