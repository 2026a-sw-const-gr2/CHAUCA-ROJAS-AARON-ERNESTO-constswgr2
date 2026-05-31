import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

// Antes: endpoints sin ninguna protección — ahora todos requieren header X-FIS-EPN-KEY
@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    // Antes: ausente — ahora API_KEY se lee de variables de entorno
    const expectedKey = process.env.API_KEY;
    const providedKey = request.headers['x-fis-epn-key'];

    if (!expectedKey) {
      throw new UnauthorizedException('API_KEY no configurada en el servidor');
    }
    if (!providedKey || providedKey !== expectedKey) {
      throw new UnauthorizedException(
        'API Key inválida o ausente (header: x-fis-epn-key)',
      );
    }
    return true;
  }
}
