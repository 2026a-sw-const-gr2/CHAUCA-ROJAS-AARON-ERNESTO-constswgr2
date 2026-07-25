import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../database/entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
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
      responsable: dto.responsable,
    });

    return this.taskRepo.save(task);
  }

  async findAll(queryDto: FindTasksQueryDto = {}): Promise<TaskEntity[]> {
    const qb = this.taskRepo.createQueryBuilder('task');

    if (queryDto.responsable) {
      qb.andWhere('task.responsable LIKE :resp', {
        resp: `%${queryDto.responsable}%`,
      });
    }

    if (queryDto.estado) {
      qb.andWhere('task.estado = :estado', { estado: queryDto.estado });
    }

    if (queryDto.desde && queryDto.hasta) {
      qb.andWhere('task.fecha_creacion BETWEEN :desde AND :hasta', {
        desde: queryDto.desde,
        hasta: queryDto.hasta,
      });
    }

    return qb.orderBy('task.id', 'DESC').getMany();
  }

  async update(id: number, dto: UpdateTaskDto): Promise<TaskEntity> {
    const task = await this.taskRepo.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    task.titulo = dto.titulo ?? task.titulo;
    task.descripcion = dto.descripcion ?? task.descripcion;
    task.estado = dto.estado ? this.normalizeStatus(dto.estado) : task.estado;
    task.responsable = dto.responsable ?? task.responsable;

    return this.taskRepo.save(task);
  }

  async remove(id: number): Promise<{ ok: boolean }> {
    const result = await this.taskRepo.delete(id);

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
