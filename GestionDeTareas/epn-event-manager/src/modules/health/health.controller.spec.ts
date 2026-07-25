import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let dataSource: { query: jest.Mock };

  beforeEach(async () => {
    dataSource = { query: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: DataSource, useValue: dataSource }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('returns status ok when the database query succeeds', async () => {
    dataSource.query.mockResolvedValue([{ '?column?': 1 }]);

    const result = await controller.check();

    expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
    expect(result).toEqual({
      status: 'ok',
      database: 'up',
    });
  });

  it('throws ServiceUnavailableException (503) when the database query fails', async () => {
    dataSource.query.mockRejectedValue(new Error('connection refused'));

    await expect(controller.check()).rejects.toBeInstanceOf(ServiceUnavailableException);

    try {
      await controller.check();
      fail('expected controller.check() to throw');
    } catch (error) {
      const exception = error as ServiceUnavailableException;
      expect(exception.getStatus()).toBe(503);
      const response = exception.getResponse() as Record<string, unknown>;
      expect(response.status).toBe('error');
      expect(response.database).toBe('down');
      expect(typeof response.timestamp).toBe('string');
    }
  });
});
