import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../common/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Dashboard")
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  @ApiOperation({ summary: 'Get dashboard KPIs' })
  getKpis(@User() user: AuthenticatedUser) {
    return this.dashboardService.getKpis(user);
  }
}
