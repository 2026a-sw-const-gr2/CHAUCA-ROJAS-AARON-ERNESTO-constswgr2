import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from '../../database/entities/event.entity';

import { CreateEventEntity } from '../../database/entities/create-event.entity';
import { UpdateEventEntity } from '../../database/entities/update-event.entity';
import { DeleteEventEntity } from '../../database/entities/delete-event.entity';
import { QueryEventEntity } from '../../database/entities/query-event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
    @InjectRepository(CreateEventEntity)
    private readonly createRepo: Repository<CreateEventEntity>,
    @InjectRepository(UpdateEventEntity)
    private readonly updateRepo: Repository<UpdateEventEntity>,
    @InjectRepository(DeleteEventEntity)
    private readonly deleteRepo: Repository<DeleteEventEntity>,
    @InjectRepository(QueryEventEntity)
    private readonly queryRepo: Repository<QueryEventEntity>,
  ) {}

  async registerEvent(dto: CreateEventDto): Promise<{ ok: boolean }> {
    const action = (dto.action ?? '').toUpperCase();
    const payloadStr = JSON.stringify(dto.payload ?? {});
    // Fecha guardada en formato ISO/UTC estandarizado
    const isoDate = new Date().toISOString();

    if (['CREATE', 'UPDATE', 'DELETE', 'QUERY'].includes(action)) {
      const ev = this.eventRepo.create({
        source: dto.source,
        entity: dto.entity,
        action: dto.action,
        title: dto.title,
        description: dto.description,
        payload: payloadStr,
        created_at: isoDate,
      });
      await this.eventRepo.save(ev);
      return { ok: true };
    }

    return { ok: false };
  }

  async findAll(): Promise<object[]> {
    // Incidencia perfectiva: agrega 4 tablas en memoria sin orden garantizado
    const creates = await this.createRepo.find({ order: { recorded_at: 'ASC'}});
    const updates = await this.updateRepo.find({ order: { timestamp: 'ASC'}});
    const deletes = await this.deleteRepo.find({ order: { createdAt: 'ASC'}});
    const queries = await this.queryRepo.find({ order: { event_date: 'ASC'}});

    // Ordena lexicograficamente por strings de fecha heterogeneos (incorrecto)
    const merged = [
      ...creates.map((e) => ({ ...e, _table: 'create_events' })),
      ...updates.map((e) => ({ ...e, _table: 'update_events' })),
      ...deletes.map((e) => ({ ...e, _table: 'delete_events' })),
      ...queries.map((e) => ({ ...e, _table: 'query_events' })),
    ];

    return merged;
  }

  async findBySource(source: string): Promise<object[]> {
    return await this.eventRepo.findBy({ source });
  }

  async findByEntity(entity: string): Promise<object[]> {
    // Incidencia preventiva: parametro entity usado directamente sin sanitizar
    const creates = await this.createRepo.findBy({ entity });
    const updates = await this.updateRepo.findBy({ entity });
    const deletes = await this.deleteRepo.findBy({ entity });
    const queries = await this.queryRepo.findBy({ entity });
    return [...creates, ...updates, ...deletes, ...queries];
  }
}
