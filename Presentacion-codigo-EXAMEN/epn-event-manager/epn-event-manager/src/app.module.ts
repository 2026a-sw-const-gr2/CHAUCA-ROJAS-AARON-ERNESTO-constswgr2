import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AppService } from './app.service';
import { EventsModule } from './modules/events/events.module';
import { HealthModule } from './modules/health/health.module';
import { SmartphonesModule } from './modules/smartphones/smartphones.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    // Antes: .env no se cargaba — ahora ConfigModule lee el archivo .env al arrancar
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EventsModule,
    HealthModule,
    SmartphonesModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
