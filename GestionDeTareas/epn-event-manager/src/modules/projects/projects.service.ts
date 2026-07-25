import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../../database/entities/project.entity';
import { TaskEntity } from '../../database/entities/task.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
  ) {}

  async create(dto: CreateProjectDto): Promise<ProjectEntity> {
    const project = this.projectRepo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? '',
    });

    return this.projectRepo.save(project);
  }

  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepo.find({
      order: { id: 'DESC' },
    });
  }

  async getProjectTasks(projectId: number): Promise<TaskEntity[]> {
    const project = await this.projectRepo.findOneBy({ id: projectId });

    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return this.taskRepo.find({ where: { projectId } });
  }
}
