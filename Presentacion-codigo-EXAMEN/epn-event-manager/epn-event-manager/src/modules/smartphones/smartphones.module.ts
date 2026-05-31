import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartphoneEntity } from '../../database/entities/smartphone.entity';
import { EventsModule } from '../events/events.module';
import { SmartphonesController } from './smartphones.controller';
import { SmartphonesService } from './smartphones.service';

@Module({
  imports: [TypeOrmModule.forFeature([SmartphoneEntity]), EventsModule],
  controllers: [SmartphonesController],
  providers: [SmartphonesService],
})
export class SmartphonesModule {}
