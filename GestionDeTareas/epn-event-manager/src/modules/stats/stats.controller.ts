import { Controller, Get, Query } from '@nestjs/common';
import { StatsQueryDto } from './dto/stats-query.dto';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getStats(@Query() query: StatsQueryDto) {
    return this.statsService.getStats(query);
  }
}
