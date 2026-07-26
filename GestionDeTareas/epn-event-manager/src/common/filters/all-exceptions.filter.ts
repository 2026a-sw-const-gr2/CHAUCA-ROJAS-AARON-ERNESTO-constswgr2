import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

type ErrorBody = {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Record<string, unknown>>();
    const response = ctx.getResponse();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, error } = this.resolvePayload(exception, statusCode);

    if (!(exception instanceof HttpException)) {
      const stack =
        exception instanceof Error ? exception.stack : String(exception);
      this.logger.error(stack);
    }

    const body: ErrorBody = {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request) as string,
    };

    httpAdapter.reply(response, body, statusCode);
  }

  private resolvePayload(
    exception: unknown,
    statusCode: number,
  ): { message: string | string[]; error: string } {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return {
          message: exceptionResponse,
          error: this.statusLabel(statusCode),
        };
      }

      const payload = exceptionResponse as Record<string, unknown>;
      const message =
        (payload.message as string | string[] | undefined) ??
        exception.message;
      const error =
        (typeof payload.error === 'string' && payload.error) ||
        this.statusLabel(statusCode);

      return { message, error };
    }

    const isProduction = process.env.NODE_ENV === 'production';
    return {
      message: isProduction
        ? 'Internal server error'
        : exception instanceof Error
          ? exception.message
          : 'Internal server error',
      error: 'Internal Server Error',
    };
  }

  private statusLabel(statusCode: number): string {
    const key = HttpStatus[statusCode];
    if (typeof key !== 'string') {
      return 'Error';
    }

    return key
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
