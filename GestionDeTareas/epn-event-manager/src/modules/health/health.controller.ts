import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

  @Get()
  async check() {
    try {
      // Verifica conectividad real a la base de datos
      await this.dataSource.query('SELECT 1');
      return {
        status: 'ok',
        database: 'up',
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
