import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: { create: jest.Mock; save: jest.Mock };

  beforeEach(async () => {
    eventRepository = {
      create: jest.fn(),
      save: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(EventEntity),
          useValue: eventRepository,
        },
      ],
    }).compile();
    service = module.get<EventsService>(EventsService);
  });

  it('throws BadRequestException for invalid actions', async () => {
    const dto: CreateEventDto = {
      source: 'test',
      entity: 'task',
      action: 'INVALID',
      title: 'bad',
      description: 'bad',
      payload: { query_term: 'x' } as Record<string, unknown>,
    };

    await expect(service.registerEvent(dto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.registerEvent(dto)).rejects.toThrow(
      'Acción de evento no permitida u objeto malformado',
    );
  });
});