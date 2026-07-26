import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../database/entities/task.entity';
import { EventsService } from '../events/events.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repo: jest.Mocked<Repository<TaskEntity>>;
  let eventsService: jest.Mocked<EventsService>;
  let andWhere: jest.Mock;
  let orderBy: jest.Mock;
  let getMany: jest.Mock;

  beforeEach(async () => {
    andWhere = jest.fn();
    orderBy = jest.fn();
    getMany = jest.fn().mockResolvedValue([]);

    const qb = {
      andWhere,
      orderBy,
      getMany,
    };
    andWhere.mockReturnValue(qb);
    orderBy.mockReturnValue(qb);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(qb),
          },
        },
        {
          provide: EventsService,
          useValue: {
            registerEvent: jest.fn().mockResolvedValue({ ok: true }),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(TaskEntity));
    eventsService = module.get(EventsService);
  });

  describe('create', () => {
    it('creates a task including the responsable field', async () => {
      const dto: CreateTaskDto = { titulo: 'Test', responsable: 'Juan' };
      const created = { id: 1, ...dto, estado: 'pendiente' } as TaskEntity;
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(dto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const createMock = jest.mocked(repo.create);

      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({ responsable: 'Juan' }),
      );
      expect(result).toEqual(created);
    });

    it('registers a CREATE audit event after saving the task', async () => {
      const dto: CreateTaskDto = { titulo: 'Test', responsable: 'Juan' };
      const created = { id: 1, ...dto, estado: 'pendiente' } as TaskEntity;
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      await service.create(dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventsService.registerEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'tasks',
          entity: 'task',
          action: 'CREATE',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          payload: expect.objectContaining({ id: 1 }),
        }),
      );
    });

    it('does not fail the create operation when the audit event fails', async () => {
      const dto: CreateTaskDto = { titulo: 'Test', responsable: 'Juan' };
      const created = { id: 1, ...dto, estado: 'pendiente' } as TaskEntity;
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);
      eventsService.registerEvent.mockRejectedValueOnce(
        new Error('audit down'),
      );

      const result = await service.create(dto);

      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('applies no filters when query is empty', async () => {
      await service.findAll({});

      expect(andWhere).not.toHaveBeenCalled();
      expect(orderBy).toHaveBeenCalledWith('task.id', 'DESC');
      expect(getMany).toHaveBeenCalled();
    });

    it('filters only by responsable', async () => {
      await service.findAll({ responsable: 'Juan' });

      expect(andWhere).toHaveBeenCalledWith('task.responsable LIKE :resp', {
        resp: '%Juan%',
      });
      expect(andWhere).toHaveBeenCalledTimes(1);
    });

    it('filters only by date range', async () => {
      await service.findAll({ desde: '2026-01-01', hasta: '2026-12-31' });

      expect(andWhere).toHaveBeenCalledWith(
        'task.fecha_creacion BETWEEN :desde AND :hasta',
        { desde: '2026-01-01', hasta: '2026-12-31' },
      );
      expect(andWhere).toHaveBeenCalledTimes(1);
    });

    it('combines responsable and date range filters', async () => {
      await service.findAll({
        responsable: 'Juan',
        desde: '2026-01-01',
        hasta: '2026-12-31',
        estado: 'pendiente',
      });

      expect(andWhere).toHaveBeenCalledTimes(3);
      expect(andWhere).toHaveBeenCalledWith('task.responsable LIKE :resp', {
        resp: '%Juan%',
      });
      expect(andWhere).toHaveBeenCalledWith('task.estado = :estado', {
        estado: 'pendiente',
      });
      expect(andWhere).toHaveBeenCalledWith(
        'task.fecha_creacion BETWEEN :desde AND :hasta',
        { desde: '2026-01-01', hasta: '2026-12-31' },
      );
    });
  });

  describe('update', () => {
    it('throws NotFoundException when task does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const dto: UpdateTaskDto = {};

      await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
    });

    it('updates the responsable field when provided', async () => {
      const task = {
        id: 1,
        titulo: 'Old',
        descripcion: 'Old',
        estado: 'pendiente',
        responsable: 'Old Owner',
      } as TaskEntity;
      repo.findOneBy.mockResolvedValue(task);
      repo.save.mockImplementation((t) => Promise.resolve(t as TaskEntity));

      const dto: UpdateTaskDto = { responsable: 'New Owner' };
      const result = await service.update(1, dto);

      expect(result.responsable).toBe('New Owner');
    });

    it('registers an UPDATE audit event after saving the task', async () => {
      const task = {
        id: 1,
        titulo: 'Old',
        descripcion: 'Old',
        estado: 'pendiente',
        responsable: 'Old Owner',
      } as TaskEntity;
      repo.findOneBy.mockResolvedValue(task);
      repo.save.mockImplementation((t) => Promise.resolve(t as TaskEntity));

      await service.update(1, { responsable: 'New Owner' });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventsService.registerEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'tasks',
          entity: 'task',
          action: 'UPDATE',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          payload: expect.objectContaining({ id: 1 }),
        }),
      );
    });

    it('does not fail the update operation when the audit event fails', async () => {
      const task = {
        id: 1,
        titulo: 'Old',
        descripcion: 'Old',
        estado: 'pendiente',
        responsable: 'Old Owner',
      } as TaskEntity;
      repo.findOneBy.mockResolvedValue(task);
      repo.save.mockImplementation((t) => Promise.resolve(t as TaskEntity));
      eventsService.registerEvent.mockRejectedValueOnce(
        new Error('audit down'),
      );

      const result = await service.update(1, { responsable: 'New Owner' });

      expect(result.responsable).toBe('New Owner');
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when no rows were affected', async () => {
      repo.findOneBy.mockResolvedValue(null);
      repo.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('removes an existing task and registers a DELETE audit event', async () => {
      const task = { id: 1, titulo: 'Old' } as TaskEntity;
      repo.findOneBy.mockResolvedValue(task);
      repo.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.remove(1);

      expect(result).toEqual({ ok: true });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventsService.registerEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'tasks',
          entity: 'task',
          action: 'DELETE',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          payload: expect.objectContaining({ id: 1 }),
        }),
      );
    });

    it('does not fail the remove operation when the audit event fails', async () => {
      const task = { id: 1, titulo: 'Old' } as TaskEntity;
      repo.findOneBy.mockResolvedValue(task);
      repo.delete.mockResolvedValue({ affected: 1, raw: {} });
      eventsService.registerEvent.mockRejectedValueOnce(
        new Error('audit down'),
      );

      const result = await service.remove(1);

      expect(result).toEqual({ ok: true });
    });
  });
});
