import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SmartphoneEntity } from '../../database/entities/smartphone.entity';
import { EventsService } from '../events/events.service';
import { SmartphonesService } from './smartphones.service';

// Antes: solo existía el test de plantilla "Hello World!" — sin cobertura de lógica de negocio
// Ahora: pruebas unitarias sobre validateBasicFields y todos los métodos CRUD

const mockSmartphone: SmartphoneEntity = {
  id: 1,
  brand: 'Apple',
  model: 'iPhone 15',
  price: 999.99,
  storage: '128GB',
  created_at: '2026-05-29T00:00:00.000Z',
  updated_at: '2026-05-29T00:00:00.000Z',
};

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

const mockEventsService = {
  registerEvent: jest.fn(),
};

describe('SmartphonesService', () => {
  let service: SmartphonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SmartphonesService,
        { provide: getRepositoryToken(SmartphoneEntity), useValue: mockRepo },
        { provide: EventsService, useValue: mockEventsService },
      ],
    }).compile();

    service = module.get<SmartphonesService>(SmartphonesService);

    jest.clearAllMocks();
    mockRepo.create.mockReturnValue(mockSmartphone);
    mockRepo.save.mockResolvedValue(mockSmartphone);
    mockRepo.find.mockResolvedValue([mockSmartphone]);
    mockRepo.findOneBy.mockResolvedValue(mockSmartphone);
    mockRepo.remove.mockResolvedValue(mockSmartphone);
    mockEventsService.registerEvent.mockResolvedValue({ ok: true });
  });

  // --- CREATE ---
  describe('create', () => {
    it('debería crear y retornar un smartphone con datos válidos', async () => {
      const result = await service.create({
        brand: 'Apple',
        model: 'iPhone 15',
        price: 999.99,
        storage: '128GB',
      });
      expect(result).toEqual(mockSmartphone);
      expect(mockRepo.save).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar BadRequestException si brand está vacía', async () => {
      await expect(
        service.create({ brand: '  ', model: 'iPhone 15', price: 999.99, storage: '128GB' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar BadRequestException si model está vacío', async () => {
      await expect(
        service.create({ brand: 'Apple', model: '', price: 999.99, storage: '128GB' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar BadRequestException si price es cero', async () => {
      await expect(
        service.create({ brand: 'Apple', model: 'iPhone 15', price: 0, storage: '128GB' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar BadRequestException si price es negativo', async () => {
      await expect(
        service.create({ brand: 'Apple', model: 'iPhone 15', price: -50, storage: '128GB' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar BadRequestException si storage está vacío', async () => {
      await expect(
        service.create({ brand: 'Apple', model: 'iPhone 15', price: 999.99, storage: '' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // --- FIND ALL ---
  describe('findAll', () => {
    it('debería retornar el listado de smartphones', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockSmartphone]);
      expect(mockRepo.find).toHaveBeenCalledTimes(1);
    });

    it('debería retornar array vacío cuando no hay smartphones', async () => {
      mockRepo.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  // --- FIND ONE ---
  describe('findOne', () => {
    it('debería retornar el smartphone con el id indicado', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockSmartphone);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('debería lanzar NotFoundException si el id no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  // --- UPDATE ---
  describe('update', () => {
    it('debería actualizar y retornar el smartphone', async () => {
      const updated = { ...mockSmartphone, brand: 'Samsung' };
      mockRepo.save.mockResolvedValue(updated);
      const result = await service.update(1, { brand: 'Samsung' });
      expect(result.brand).toBe('Samsung');
    });

    it('debería lanzar NotFoundException si el id no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.update(999, { brand: 'Samsung' })).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException si el precio actualizado es cero', async () => {
      await expect(service.update(1, { price: 0 })).rejects.toThrow(BadRequestException);
    });
  });

  // --- REMOVE ---
  describe('remove', () => {
    it('debería eliminar y retornar el smartphone eliminado', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(mockSmartphone);
      expect(mockRepo.remove).toHaveBeenCalledTimes(1);
    });

    it('debería lanzar NotFoundException si el id no existe', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
