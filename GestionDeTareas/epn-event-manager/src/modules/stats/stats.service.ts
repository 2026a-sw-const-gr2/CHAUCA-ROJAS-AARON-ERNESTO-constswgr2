import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventEntity } from '../../database/entities/create-event.entity';
import { UpdateEventEntity } from '../../database/entities/update-event.entity';
import { DeleteEventEntity } from '../../database/entities/delete-event.entity';
import { QueryEventEntity } from '../../database/entities/query-event.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(CreateEventEntity)
    private createRepo: Repository<CreateEventEntity>,
    @InjectRepository(UpdateEventEntity)
    private updateRepo: Repository<UpdateEventEntity>,
    @InjectRepository(DeleteEventEntity)
    private deleteRepo: Repository<DeleteEventEntity>,
    @InjectRepository(QueryEventEntity)
    private queryRepo: Repository<QueryEventEntity>,
  ) {}

  async getStats(): Promise<object> {
    const createCount = await this.createRepo.count();
    const updateCount = await this.updateRepo.count();
    const deleteCount = await this.deleteRepo.count();
    const queryCount = await this.queryRepo.count();

    return {
      create: createCount,
      update: updateCount,
      delete: deleteCount,
      query: queryCount,
      total: createCount + updateCount + deleteCount + queryCount,
    };
  }
}
