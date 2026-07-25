import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TaskEntity } from '../../database/entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repo: jest.Mocked<Repository<TaskEntity>>;
  let qb: jest.Mocked<SelectQueryBuilder<TaskEntity>>;

  beforeEach(async () => {
    qb = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<SelectQueryBuilder<TaskEntity>>;

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
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(TaskEntity));
  });

  describe('create', () => {
    it('creates a task including the responsable field', async () => {
      const dto = { titulo: 'Test', responsable: 'Juan' };
      const created = { id: 1, ...dto, estado: 'pendiente' } as TaskEntity;
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(dto as any);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ responsable: 'Juan' }),
      );
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('applies no filters when query is empty', async () => {
      await service.findAll({});

      expect(qb.andWhere).not.toHaveBeenCalled();
      expect(qb.orderBy).toHaveBeenCalledWith('task.id', 'DESC');
      expect(qb.getMany).toHaveBeenCalled();
    });

    it('filters only by responsable', async () => {
      await service.findAll({ responsable: 'Juan' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'task.responsable LIKE :resp',
        { resp: '%Juan%' },
      );
      expect(qb.andWhere).toHaveBeenCalledTimes(1);
    });

    it('filters only by date range', async () => {
      await service.findAll({ desde: '2026-01-01', hasta: '2026-12-31' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'task.fecha_creacion BETWEEN :desde AND :hasta',
        { desde: '2026-01-01', hasta: '2026-12-31' },
      );
      expect(qb.andWhere).toHaveBeenCalledTimes(1);
    });

    it('combines responsable and date range filters', async () => {
      await service.findAll({
        responsable: 'Juan',
        desde: '2026-01-01',
        hasta: '2026-12-31',
        estado: 'pendiente',
      });

      expect(qb.andWhere).toHaveBeenCalledTimes(3);
      expect(qb.andWhere).toHaveBeenCalledWith(
        'task.responsable LIKE :resp',
        { resp: '%Juan%' },
      );
      expect(qb.andWhere).toHaveBeenCalledWith('task.estado = :estado', {
        estado: 'pendiente',
      });
      expect(qb.andWhere).toHaveBeenCalledWith(
        'task.fecha_creacion BETWEEN :desde AND :hasta',
        { desde: '2026-01-01', hasta: '2026-12-31' },
      );
    });
  });

  describe('update', () => {
    it('throws NotFoundException when task does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
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

      const result = await service.update(1, {
        responsable: 'New Owner',
      } as any);

      expect(result.responsable).toBe('New Owner');
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when no rows were affected', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('removes an existing task', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove(1);

      expect(result).toEqual({ ok: true });
    });
  });
});
