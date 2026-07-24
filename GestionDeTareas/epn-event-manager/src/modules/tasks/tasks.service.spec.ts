import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../database/entities/task.entity';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repo: jest.Mocked<Repository<TaskEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(TaskEntity));
  });

  describe('create', () => {
    it('creates a task with default status when none provided', async () => {
      const dto = { titulo: 'Test', descripcion: 'Desc' };
      const created = { id: 1, ...dto, estado: 'pendiente' } as TaskEntity;
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

      const result = await service.create(dto as any);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: 'Test', estado: 'pendiente' }),
      );
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('excludes soft-deleted tasks by default', async () => {
      repo.find.mockResolvedValue([]);

      await service.findAll();

      expect(repo.find).toHaveBeenCalledWith({
        order: { id: 'DESC' },
        withDeleted: false,
      });
    });

    it('includes soft-deleted tasks when includeDeleted is true', async () => {
      repo.find.mockResolvedValue([]);

      await service.findAll(true);

      expect(repo.find).toHaveBeenCalledWith({
        order: { id: 'DESC' },
        withDeleted: true,
      });
    });
  });

  describe('update', () => {
    it('throws NotFoundException when task does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);

      await expect(service.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('updates and saves an existing task', async () => {
      const task = {
        id: 1,
        titulo: 'Old',
        descripcion: 'Old',
        estado: 'pendiente',
      } as TaskEntity;
      repo.findOneBy.mockResolvedValue(task);
      repo.save.mockResolvedValue({ ...task, titulo: 'New' } as TaskEntity);

      const result = await service.update(1, { titulo: 'New' } as any);

      expect(result.titulo).toBe('New');
    });
  });

  describe('remove', () => {
    it('calls softDelete instead of a hard delete', async () => {
      repo.softDelete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.remove(1);

      expect(repo.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ ok: true });
    });

    it('throws NotFoundException when no rows were affected', async () => {
      repo.softDelete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
