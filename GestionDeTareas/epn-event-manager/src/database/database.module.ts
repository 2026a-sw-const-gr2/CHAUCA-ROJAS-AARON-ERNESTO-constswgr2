import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateEventEntity } from './entities/create-event.entity';
import { UpdateEventEntity } from './entities/update-event.entity';
import { DeleteEventEntity } from './entities/delete-event.entity';
import { QueryEventEntity } from './entities/query-event.entity';
import { TaskEntity } from './entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE', 'better-sqlite3'),
        database: configService.get<string>('DB_NAME', 'db/events.sqlite'),
        entities: [
          CreateEventEntity,
          UpdateEventEntity,
          DeleteEventEntity,
          QueryEventEntity,
          TaskEntity,
        ],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
