import {
  Controller,
  Get,
  Logger,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';

// Antes: sin protección ni logs — ahora protegido con ApiKeyGuard y Logger estructurado
@ApiTags('Health')
@ApiSecurity('x-fis-epn-key')
@UseGuards(ApiKeyGuard)
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check() {
    const timestamp = new Date().toISOString();

    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log({ operation: 'HEALTH_CHECK', result: 'ok', timestamp });
      return { status: 'ok', database: 'ok', timestamp };
    } catch {
      this.logger.error({
        operation: 'HEALTH_CHECK',
        result: 'error',
        database: 'down',
        timestamp,
      });
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
        timestamp,
      });
    }
  }
}
