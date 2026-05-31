import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventAction } from '../../database/entities/event.entity';
import { SmartphoneEntity } from '../../database/entities/smartphone.entity';
import { EventsService } from '../events/events.service';
import { CreateSmartphoneDto } from './dto/create-smartphone.dto';
import { UpdateSmartphoneDto } from './dto/update-smartphone.dto';

@Injectable()
export class SmartphonesService {
  // Antes: console.log sin niveles ni timestamp — ahora Logger con INFO/WARN/ERROR e ISO 8601
  private readonly logger = new Logger(SmartphonesService.name);

  constructor(
    @InjectRepository(SmartphoneEntity)
    private readonly smartphonesRepo: Repository<SmartphoneEntity>,
    private readonly eventsService: EventsService,
  ) {}

  async create(dto: CreateSmartphoneDto): Promise<SmartphoneEntity> {
    this.validateBasicFields(dto);
    // Antes: sin try-catch — ahora errores de BD quedan controlados
    try {
      const now = new Date().toISOString();
      const smartphone = this.smartphonesRepo.create({
        brand: dto.brand.trim(),
        model: dto.model.trim(),
        price: Number(dto.price),
        storage: dto.storage.trim(),
        created_at: now,
        updated_at: now,
      });

      const saved = await this.smartphonesRepo.save(smartphone);
      this.logger.log({
        operation: 'CREATE',
        entity: 'smartphone',
        id: saved.id,
        result: 'ok',
        timestamp: new Date().toISOString(),
      });
      await this.safeRegisterEvent(EventAction.Create, 'Smartphone creado', saved);
      return saved;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error({
        operation: 'CREATE',
        entity: 'smartphone',
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al crear el smartphone');
    }
  }

  async findAll(): Promise<SmartphoneEntity[]> {
    // Antes: sin try-catch — ahora errores de BD controlados
    try {
      const smartphones = await this.smartphonesRepo.find({
        order: { id: 'ASC' },
      });
      this.logger.log({
        operation: 'QUERY',
        entity: 'smartphone',
        total: smartphones.length,
        result: 'ok',
        timestamp: new Date().toISOString(),
      });
      await this.safeRegisterEvent(EventAction.Query, 'Smartphones consultados', {
        total: smartphones.length,
      });
      return smartphones;
    } catch (error) {
      this.logger.error({
        operation: 'QUERY',
        entity: 'smartphone',
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al consultar smartphones');
    }
  }

  async findOne(id: number): Promise<SmartphoneEntity> {
    // Antes: sin try-catch — ahora errores de BD controlados
    try {
      const smartphone = await this.smartphonesRepo.findOneBy({ id });
      if (!smartphone) {
        // Antes: NotFoundException lanzada sin log — ahora WARN antes de lanzar
        this.logger.warn({
          operation: 'QUERY',
          entity: 'smartphone',
          id,
          result: 'not_found',
          timestamp: new Date().toISOString(),
        });
        throw new NotFoundException('Smartphone no encontrado');
      }

      this.logger.log({
        operation: 'QUERY',
        entity: 'smartphone',
        id,
        result: 'ok',
        timestamp: new Date().toISOString(),
      });
      await this.safeRegisterEvent(EventAction.Query, 'Smartphone consultado', smartphone);
      return smartphone;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error({
        operation: 'QUERY',
        entity: 'smartphone',
        id,
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al consultar el smartphone');
    }
  }

  async update(id: number, dto: UpdateSmartphoneDto): Promise<SmartphoneEntity> {
    // Antes: sin try-catch — ahora errores de BD controlados
    try {
      const smartphone = await this.smartphonesRepo.findOneBy({ id });
      if (!smartphone) {
        this.logger.warn({
          operation: 'UPDATE',
          entity: 'smartphone',
          id,
          result: 'not_found',
          timestamp: new Date().toISOString(),
        });
        throw new NotFoundException('Smartphone no encontrado');
      }

      const updated = {
        ...smartphone,
        ...dto,
        brand: dto.brand?.trim() ?? smartphone.brand,
        model: dto.model?.trim() ?? smartphone.model,
        price: dto.price === undefined ? smartphone.price : Number(dto.price),
        storage: dto.storage?.trim() ?? smartphone.storage,
        updated_at: new Date().toISOString(),
      };
      this.validateBasicFields(updated);

      const saved = await this.smartphonesRepo.save(updated);
      this.logger.log({
        operation: 'UPDATE',
        entity: 'smartphone',
        id,
        result: 'ok',
        timestamp: new Date().toISOString(),
      });
      await this.safeRegisterEvent(EventAction.Update, 'Smartphone actualizado', saved);
      return saved;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error({
        operation: 'UPDATE',
        entity: 'smartphone',
        id,
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al actualizar el smartphone');
    }
  }

  async remove(id: number): Promise<SmartphoneEntity> {
    // Antes: sin try-catch — ahora errores de BD controlados
    try {
      const smartphone = await this.smartphonesRepo.findOneBy({ id });
      if (!smartphone) {
        this.logger.warn({
          operation: 'DELETE',
          entity: 'smartphone',
          id,
          result: 'not_found',
          timestamp: new Date().toISOString(),
        });
        throw new NotFoundException('Smartphone no encontrado');
      }

      await this.smartphonesRepo.remove(smartphone);
      this.logger.log({
        operation: 'DELETE',
        entity: 'smartphone',
        id,
        result: 'ok',
        timestamp: new Date().toISOString(),
      });
      await this.safeRegisterEvent(EventAction.Delete, 'Smartphone eliminado', smartphone);
      return smartphone;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error({
        operation: 'DELETE',
        entity: 'smartphone',
        id,
        result: 'error',
        message: (error as Error).message,
        timestamp: new Date().toISOString(),
      });
      throw new InternalServerErrorException('Error al eliminar el smartphone');
    }
  }

  private validateBasicFields(
    data: CreateSmartphoneDto | UpdateSmartphoneDto | SmartphoneEntity,
  ): void {
    if (!data.brand?.trim()) {
      throw new BadRequestException('La marca es obligatoria');
    }
    if (!data.model?.trim()) {
      throw new BadRequestException('El modelo es obligatorio');
    }
    if (data.price === undefined || Number(data.price) <= 0) {
      throw new BadRequestException('El precio debe ser mayor a 0');
    }
    if (!data.storage?.trim()) {
      throw new BadRequestException('El almacenamiento es obligatorio');
    }
  }

  // Antes: registerCrudEvent propagaba errores y rompía el flujo si el evento fallaba
  // Ahora: safeRegisterEvent captura el error y lo registra como WARN sin afectar la operación CRUD
  private async safeRegisterEvent(
    action: EventAction,
    title: string,
    payload: SmartphoneEntity | Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.eventsService.registerEvent({
        source: 'epn-event-manager',
        entity: 'smartphone',
        action,
        title,
        description: `Operacion ${action} del CRUD de smartphones`,
        payload: { ...payload },
      });
    } catch (eventError) {
      this.logger.warn({
        operation: action,
        entity: 'smartphone',
        result: 'event_registration_failed',
        message: (eventError as Error).message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
