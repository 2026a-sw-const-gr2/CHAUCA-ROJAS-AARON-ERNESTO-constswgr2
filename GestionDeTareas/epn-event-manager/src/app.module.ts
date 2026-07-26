import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './modules/events/events.module';
import { HealthModule } from './modules/health/health.module';
import { StatsModule } from './modules/stats/stats.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ProjectsModule } from './modules/projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Tiempo de vida: 1 minuto (60,000 ms)
        limit: 100, // Máximo 100 peticiones por IP en el lapso de ttl
      },
    ]),
    DatabaseModule,
    EventsModule,
    HealthModule,
    StatsModule,
    TasksModule,
    ProjectsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
