import { Controller, Get, Inject } from '@nestjs/common';
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
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        status: 'error',
        database: 'disconnected',
        error: message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
