import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../../database/entities/event.entity';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  let service: StatsService;
  let andWhere: jest.Mock;
  let groupBy: jest.Mock;
  let addSelect: jest.Mock;
  let select: jest.Mock;
  let getRawMany: jest.Mock;
  let repo: jest.Mocked<Repository<EventEntity>>;

  beforeEach(async () => {
    getRawMany = jest.fn().mockResolvedValue([]);

    const qb: Record<string, jest.Mock> = {};
    select = jest.fn().mockReturnValue(qb);
    addSelect = jest.fn().mockReturnValue(qb);
    groupBy = jest.fn().mockReturnValue(qb);
    andWhere = jest.fn().mockReturnValue(qb);
    Object.assign(qb, { select, addSelect, groupBy, andWhere, getRawMany });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: getRepositoryToken(EventEntity),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(qb),
          },
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
    repo = module.get(getRepositoryToken(EventEntity));
  });

  it('builds a single aggregated query grouped by action', async () => {
    await service.getStats({});

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(repo.createQueryBuilder).toHaveBeenCalledWith('e');
    expect(select).toHaveBeenCalledWith('e.action', 'action');
    expect(addSelect).toHaveBeenCalledWith('COUNT(*)', 'count');
    expect(groupBy).toHaveBeenCalledWith('e.action');
    expect(andWhere).not.toHaveBeenCalled();
  });

  it('applies the date range filter when desde and hasta are provided', async () => {
    await service.getStats({ desde: '2026-01-01', hasta: '2026-12-31' });

    expect(andWhere).toHaveBeenCalledWith(
      'e.created_at BETWEEN :desde AND :hasta',
      { desde: '2026-01-01', hasta: '2026-12-31' },
    );
  });

  it('maps grouped counts into the expected response shape', async () => {
    getRawMany.mockResolvedValue([
      { action: 'CREATE', count: '3' },
      { action: 'UPDATE', count: '2' },
      { action: 'DELETE', count: '1' },
      { action: 'QUERY', count: '4' },
    ]);

    const result = await service.getStats({});

    expect(result).toEqual({
      create: 3,
      update: 2,
      delete: 1,
      query: 4,
      total: 10,
    });
  });

  it('defaults missing actions to zero', async () => {
    getRawMany.mockResolvedValue([{ action: 'CREATE', count: '5' }]);

    const result = await service.getStats({});

    expect(result).toEqual({
      create: 5,
      update: 0,
      delete: 0,
      query: 0,
      total: 5,
    });
  });
});
