import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventAction, EventEntity } from '../../database/entities/event.entity';

export interface EventStats {
  create: number;
  update: number;
  delete: number;
  query: number;
  total: number;
}

@Injectable()
export class StatsService {
  // Antes: sin Logger ni try-catch — ahora con Logger y errores de BD controlados
  private readonly logger = new Logger(StatsService.name);

  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepo: Repository<EventEntity>,
  ) {}

  async getStats(): Promise<EventStats> {
    // Antes: sin try-catch — ahora errores de BD no tumban el servidor
    try {
      const [create, update, deleteCount, query] = await Promise.all([
        this.eventsRepo.countBy({ action: EventAction.Create }),
        this.eventsRepo.countBy({ action: EventAction.Update }),
        this.eventsRepo.countBy({ action: EventAction.Delete }),
        this.eventsRepo.countBy({ action: EventAction.Query }),
      ]);

      const stats: EventStats = {
        create,
        update,
        delete: deleteCount,
        query,
        total: create + update + deleteCount + query,
      };
      this.logger.log({
        operation: 'QUERY_STATS',
        result: 'ok',
        timestamp: new Date().toISOString(),
      });
      return stats;
    } catch (error) {
      this.logger.error({
        operation: 'QUERY_STATS',
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al obtener estadísticas');
    }
  }
}
