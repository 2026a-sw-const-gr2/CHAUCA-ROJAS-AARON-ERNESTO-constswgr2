import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { EventEntity } from '../../database/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
