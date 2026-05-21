import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from '../../database/entities/event.entity';
import { EventPayload } from './dto/create-event.dto';

import { CreateEventEntity } from '../../database/entities/create-event.entity';
import { UpdateEventEntity } from '../../database/entities/update-event.entity';
import { DeleteEventEntity } from '../../database/entities/delete-event.entity';
import { QueryEventEntity } from '../../database/entities/query-event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  async registerEvent(dto: CreateEventDto): Promise<{ ok: boolean }> {
    const action = (dto.action ?? '').toUpperCase();
    const payloadStr = JSON.stringify(dto.payload ?? {});
    // Fecha guardada en formato ISO/UTC estandarizado
    const isoDate = new Date().toISOString();

    if (['CREATE', 'UPDATE', 'DELETE', 'QUERY'].includes(action)) {
      
     // Extraemos el término de búsqueda si el payload lo contiene
      const queryTerm = dto.payload?.query_term ? String(dto.payload.query_term) : ''; 
      
      const ev = this.eventRepo.create({
        source: dto.source,
        entity: dto.entity,
        action: dto.action,
        title: dto.title,
        description: dto.description,
        payload: dto.payload as EventPayload, // Guardamos el payload como JSON estructurado
        created_at: isoDate,
        query_term: queryTerm,
      });
      await this.eventRepo.save(ev);
      return { ok: true };
    }

    return { ok: false };
  }

  // Simplificado para buscar directamente en la tabla unificada cronológicamente
  async findAll(): Promise<EventEntity[]> {
    return await this.eventRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findBySource(source: string): Promise<EventEntity[]> {
    return await this.eventRepo.findBy({ source });
  }

  // Corregido para usar la tabla unificada protegiendo contra el parámetro sin sanitizar
  async findByEntity(entity: string): Promise<EventEntity[]> {
    return await this.eventRepo.findBy({ entity });
  }
}
