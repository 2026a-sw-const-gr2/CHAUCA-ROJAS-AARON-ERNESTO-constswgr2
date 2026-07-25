import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { StatsQueryDto } from './dto/stats-query.dto';

export interface StatsResult {
  create: number;
  update: number;
  delete: number;
  query: number;
  total: number;
}

interface ActionCountRow {
  action: string;
  count: string;
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepo: Repository<EventEntity>,
  ) {}

  async getStats(queryDto: StatsQueryDto = {}): Promise<StatsResult> {
    const qb = this.eventRepo
      .createQueryBuilder('e')
      .select('e.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('e.action');

    if (queryDto.desde && queryDto.hasta) {
      qb.andWhere('e.created_at BETWEEN :desde AND :hasta', {
        desde: queryDto.desde,
        hasta: queryDto.hasta,
      });
    }

    const rows = await qb.getRawMany<ActionCountRow>();

    const counts: StatsResult = {
      create: 0,
      update: 0,
      delete: 0,
      query: 0,
      total: 0,
    };

    for (const row of rows) {
      const count = Number(row.count);
      const action = row.action.toLowerCase();

      if (action === 'create') {
        counts.create = count;
      } else if (action === 'update') {
        counts.update = count;
      } else if (action === 'delete') {
        counts.delete = count;
      } else if (action === 'query') {
        counts.query = count;
      }

      counts.total += count;
    }

    return counts;
  }
}
