import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { StatsService } from './stats.service';

// Antes: endpoint de stats público sin protección
// Ahora: requiere header X-FIS-EPN-KEY via ApiKeyGuard
@ApiTags('Stats')
@ApiSecurity('x-fis-epn-key')
@UseGuards(ApiKeyGuard)
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getStats() {
    return this.statsService.getStats();
  }
}
