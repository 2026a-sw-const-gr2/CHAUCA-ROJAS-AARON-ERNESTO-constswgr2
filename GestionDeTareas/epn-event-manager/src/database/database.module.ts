import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TaskEntity } from './entities/task.entity';
import { EventEntity } from './entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE', 'better-sqlite3'),
        database: configService.get<string>('DB_NAME', 'db/events.sqlite'),
        entities: [TaskEntity, EventEntity],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
