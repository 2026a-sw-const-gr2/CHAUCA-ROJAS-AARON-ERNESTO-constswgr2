import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { EventEntity } from './entities/event.entity';
import { ProjectEntity } from './entities/project.entity';
import { TaskEntity } from './entities/task.entity';

export const AppDataSource = new DataSource({
  type: (process.env.DB_TYPE as 'better-sqlite3') || 'better-sqlite3',
  database: process.env.DB_NAME || 'db/events.sqlite',
  entities: [TaskEntity, EventEntity, ProjectEntity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
});
