import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../database/entities/task.entity';
<<<<<<< HEAD
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
=======
>>>>>>> 07138990f8171950137a2e92852f999618399d01
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  let repo: jest.Mocked<Repository<TaskEntity>>;
<<<<<<< HEAD
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

=======

  beforeEach(async () => {
>>>>>>> 07138990f8171950137a2e92852f999618399d01
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
<<<<<<< HEAD
            findOneBy: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(qb),
=======
            find: jest.fn(),
            findOneBy: jest.fn(),
            softDelete: jest.fn(),
>>>>>>> 07138990f8171950137a2e92852f999618399d01
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(TaskEntity));
  });

  describe('create', () => {
<<<<<<< HEAD
    it('creates a task including the responsable field', async () => {
      const dto: CreateTaskDto = { titulo: 'Test', responsable: 'Juan' };
=======
    it('creates a task with default status when none provided', async () => {
      const dto = { titulo: 'Test', descripcion: 'Desc' };
>>>>>>> 07138990f8171950137a2e92852f999618399d01
      const created = { id: 1, ...dto, estado: 'pendiente' } as TaskEntity;
      repo.create.mockReturnValue(created);
      repo.save.mockResolvedValue(created);

<<<<<<< HEAD
      const result = await service.create(dto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const createMock = jest.mocked(repo.create);

      expect(createMock).toHaveBeenCalledWith(
        expect.objectContaining({ responsable: 'Juan' }),
=======
      const result = await service.create(dto as any);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ titulo: 'Test', estado: 'pendiente' }),
>>>>>>> 07138990f8171950137a2e92852f999618399d01
      );
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 07138990f8171950137a2e92852f999618399d01
    });
  });

  describe('update', () => {
    it('throws NotFoundException when task does not exist', async () => {
      repo.findOneBy.mockResolvedValue(null);

<<<<<<< HEAD
      const dto: UpdateTaskDto = {};

      await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
    });

    it('updates the responsable field when provided', async () => {
=======
      await expect(service.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('updates and saves an existing task', async () => {
>>>>>>> 07138990f8171950137a2e92852f999618399d01
      const task = {
        id: 1,
        titulo: 'Old',
        descripcion: 'Old',
        estado: 'pendiente',
<<<<<<< HEAD
        responsable: 'Old Owner',
      } as TaskEntity;
      repo.findOneBy.mockResolvedValue(task);
      repo.save.mockImplementation((t) => Promise.resolve(t as TaskEntity));

      const dto: UpdateTaskDto = { responsable: 'New Owner' };
      const result = await service.update(1, dto);

      expect(result.responsable).toBe('New Owner');
=======
      } as TaskEntity;
      repo.findOneBy.mockResolvedValue(task);
      repo.save.mockResolvedValue({ ...task, titulo: 'New' } as TaskEntity);

      const result = await service.update(1, { titulo: 'New' } as any);

      expect(result.titulo).toBe('New');
>>>>>>> 07138990f8171950137a2e92852f999618399d01
    });
  });

  describe('remove', () => {
<<<<<<< HEAD
    it('throws NotFoundException when no rows were affected', async () => {
      repo.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('removes an existing task', async () => {
      repo.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.remove(1);

      expect(result).toEqual({ ok: true });
    });
=======
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
>>>>>>> 07138990f8171950137a2e92852f999618399d01
  });
});
