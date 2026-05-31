import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from '../../database/entities/event.entity';

export interface RegisterEventResult {
  ok: boolean;
}

@Injectable()
export class EventsService {
  // Antes: sin Logger ni try-catch — ahora Logger con INFO/ERROR y errores controlados
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepo: Repository<EventEntity>,
  ) {}

  async registerEvent(dto: CreateEventDto): Promise<RegisterEventResult> {
    // Antes: sin try-catch — ahora error de persistencia controlado y logueado
    try {
      const payloadStr = JSON.stringify(dto.payload ?? {});
      const event = this.eventsRepo.create({
        source: dto.source,
        entity: dto.entity,
        action: dto.action,
        title: dto.title,
        description: dto.description ?? null,
        payload: payloadStr,
        created_at: new Date().toISOString(),
      });

      await this.eventsRepo.save(event);
      this.logger.log({
        operation: 'REGISTER_EVENT',
        action: dto.action,
        entity: dto.entity,
        result: 'ok',
        timestamp: new Date().toISOString(),
      });
      return { ok: true };
    } catch (error) {
      this.logger.error({
        operation: 'REGISTER_EVENT',
        action: dto.action,
        entity: dto.entity,
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al registrar el evento');
    }
  }

  async findAll(): Promise<EventEntity[]> {
    // Antes: sin try-catch — ahora errores de BD controlados
    try {
      return await this.eventsRepo.find({
        order: { created_at: 'DESC', id: 'DESC' },
      });
    } catch (error) {
      this.logger.error({
        operation: 'QUERY_ALL_EVENTS',
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al consultar eventos');
    }
  }

  async findBySource(source: string): Promise<EventEntity[]> {
    // Antes: sin try-catch — ahora errores de BD controlados
    try {
      return await this.eventsRepo.find({
        where: { source },
        order: { created_at: 'DESC', id: 'DESC' },
      });
    } catch (error) {
      this.logger.error({
        operation: 'QUERY_EVENTS_BY_SOURCE',
        source,
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al consultar eventos por fuente');
    }
  }

  async findByEntity(entity: string): Promise<EventEntity[]> {
    // Antes: sin try-catch — ahora errores de BD controlados
    try {
      return await this.eventsRepo.find({
        where: { entity },
        order: { created_at: 'DESC', id: 'DESC' },
      });
    } catch (error) {
      this.logger.error({
        operation: 'QUERY_EVENTS_BY_ENTITY',
        entity,
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al consultar eventos por entidad');
    }
  }
}
