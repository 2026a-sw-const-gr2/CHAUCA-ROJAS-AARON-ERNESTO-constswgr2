import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../database/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
  ) {}

  async create(dto: CreateTaskDto): Promise<TaskEntity> {
    const task = this.taskRepo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion ?? '',
      estado: this.normalizeStatus(dto.estado),
      fecha_creacion: new Date().toISOString(),
    });

    return this.taskRepo.save(task);
  }

  async findAll(includeDeleted?: boolean): Promise<TaskEntity[]> {
    return this.taskRepo.find({
      order: { id: 'DESC' },
      withDeleted: includeDeleted === true,
    });
  }

  async update(id: number, dto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.taskRepo.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    task.titulo = dto.titulo ?? task.titulo;
    task.descripcion = dto.descripcion ?? task.descripcion;
    task.estado = dto.estado ? this.normalizeStatus(dto.estado) : task.estado;

    return this.taskRepo.save(task);
  }

  async remove(id: number): Promise<{ ok: boolean }> {
    const result = await this.taskRepo.softDelete(id);

    if (!result.affected) {
      throw new NotFoundException('Tarea no encontrada');
    }

    return { ok: true };
  }

  private normalizeStatus(status?: string): string {
    const allowedStatuses = ['pendiente', 'en progreso', 'completada'];

    if (status && allowedStatuses.includes(status)) {
      return status;
    }

    return 'pendiente';
  }
}
