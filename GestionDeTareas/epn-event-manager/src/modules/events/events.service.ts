import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { EventEntity } from '../../database/entities/event.entity';

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
    // Obtiene todos los eventos de la tabla unificada
    const events = await this.eventRepo.find({
      order: { created_at: 'DESC' },
    });
    return events;
  }

  async findBySource(source: string): Promise<object[]> {
    return await this.eventRepo.findBy({ source });
  }

  async findByEntity(entity: string): Promise<object[]> {
    return await this.eventRepo.findBy({ entity });
  }
}
