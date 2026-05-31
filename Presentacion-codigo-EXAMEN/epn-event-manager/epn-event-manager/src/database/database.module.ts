import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { SmartphoneEntity } from './entities/smartphone.entity';
import { CreateEventsTable1760000000000 } from './migrations/1760000000000-CreateEventsTable';
import { CreateSmartphonesTable1760000001000 } from './migrations/1760000001000-CreateSmartphonesTable';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH ?? 'db/events.sqlite',
      entities: [EventEntity, SmartphoneEntity],
      migrations: [
        CreateEventsTable1760000000000,
        CreateSmartphonesTable1760000001000,
      ],
      migrationsRun: process.env.DB_MIGRATIONS_RUN !== 'false',
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
