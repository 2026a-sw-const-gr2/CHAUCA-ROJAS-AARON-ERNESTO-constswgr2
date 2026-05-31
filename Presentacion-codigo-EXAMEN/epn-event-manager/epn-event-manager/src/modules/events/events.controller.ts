import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

// Antes: endpoints de eventos públicos sin protección
// Ahora: todos requieren header X-FIS-EPN-KEY via ApiKeyGuard
@ApiTags('Events')
@ApiSecurity('x-fis-epn-key')
@UseGuards(ApiKeyGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  registerEvent(@Body() dto: CreateEventDto) {
    return this.eventsService.registerEvent(dto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('source/:source')
  findBySource(@Param('source') source: string) {
    return this.eventsService.findBySource(source);
  }

  @Get('entity/:entity')
  findByEntity(@Param('entity') entity: string) {
    return this.eventsService.findByEntity(entity);
  }
}
