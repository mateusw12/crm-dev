import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { SupabaseModule } from "./supabase/supabase.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { UsersModule } from "./modules/users/users.module";
import { CompaniesModule } from "./modules/companies/companies.module";
import { ContactsModule } from "./modules/contacts/contacts.module";
import { DealsModule } from "./modules/deals/deals.module";
import { GroupsModule } from "./modules/groups/groups.module";
import { InteractionsModule } from "./modules/interactions/interactions.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { BrasilApiModule } from "./modules/brasilapi/brasilapi.module";
import { UploadsModule } from './modules/uploads/uploads.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    AttachmentsModule,
    BrasilApiModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    UploadsModule,
    ContactsModule,
    CompaniesModule,
    InteractionsModule,
    DealsModule,
    TasksModule,
    DashboardModule,
    GroupsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
