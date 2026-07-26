import {
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let httpAdapter: {
    getRequestUrl: jest.Mock;
    reply: jest.Mock;
  };
  let host: ArgumentsHost;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    httpAdapter = {
      getRequestUrl: jest.fn().mockReturnValue('/tasks'),
      reply: jest.fn(),
    };

    const httpAdapterHost = {
      httpAdapter,
    } as unknown as HttpAdapterHost;

    filter = new AllExceptionsFilter(httpAdapterHost);

    host = {
      switchToHttp: () => ({
        getRequest: () => ({ url: '/tasks' }),
        getResponse: () => ({}),
      }),
    } as unknown as ArgumentsHost;

    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue('2026-07-24T17:27:25.000Z');
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  it('formats HttpException responses with the standard error payload', () => {
    filter.catch(new NotFoundException('Task not found'), host);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      {},
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Task not found',
        error: 'Not Found',
        timestamp: '2026-07-24T17:27:25.000Z',
        path: '/tasks',
      },
      HttpStatus.NOT_FOUND,
    );
  });

  it('preserves validation message arrays from BadRequestException', () => {
    filter.catch(
      new BadRequestException({
        message: ['title should not be empty', 'status must be a valid enum'],
        error: 'Bad Request',
        statusCode: 400,
      }),
      host,
    );

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      {},
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['title should not be empty', 'status must be a valid enum'],
        error: 'Bad Request',
        timestamp: '2026-07-24T17:27:25.000Z',
        path: '/tasks',
      },
      HttpStatus.BAD_REQUEST,
    );
  });

  it('returns a generic message for unhandled errors in production', () => {
    process.env.NODE_ENV = 'production';

    filter.catch(new Error('database connection refused'), host);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      {},
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Internal Server Error',
        timestamp: '2026-07-24T17:27:25.000Z',
        path: '/tasks',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    const [, body] = httpAdapter.reply.mock.calls[0] as [
      unknown,
      Record<string, unknown>,
    ];
    expect(body).not.toHaveProperty('stack');
  });

  it('exposes the error message for unhandled errors outside production', () => {
    process.env.NODE_ENV = 'development';

    filter.catch(new Error('database connection refused'), host);

    expect(httpAdapter.reply).toHaveBeenCalledWith(
      {},
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'database connection refused',
        error: 'Internal Server Error',
        timestamp: '2026-07-24T17:27:25.000Z',
        path: '/tasks',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );

    const [, body] = httpAdapter.reply.mock.calls[0] as [
      unknown,
      Record<string, unknown>,
    ];
    expect(body).not.toHaveProperty('stack');
  });
});
