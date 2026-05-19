import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/event.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
  ) {}

  async getStats(): Promise<object> {
    const createCount = await this.eventRepo.countBy({ action: 'CREATE' });
    const updateCount = await this.eventRepo.countBy({ action: 'UPDATE' });
    const deleteCount = await this.eventRepo.countBy({ action: 'DELETE' });
    const queryCount = await this.eventRepo.countBy({ action: 'QUERY' });
    const total = createCount + updateCount + deleteCount + queryCount;

    return {
      create: createCount,
      update: updateCount,
      delete: deleteCount,
      query: queryCount,
      total: total,
    };
  }
}
