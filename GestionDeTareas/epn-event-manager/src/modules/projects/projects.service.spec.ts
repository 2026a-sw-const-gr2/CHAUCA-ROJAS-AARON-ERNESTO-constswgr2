import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from '../../database/entities/project.entity';
import { TaskEntity } from '../../database/entities/task.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: { create: jest.Mock; save: jest.Mock; find: jest.Mock; findOneBy: jest.Mock };
  let taskRepository: { find: jest.Mock };

  beforeEach(async () => {
    projectRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
    };
    taskRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(ProjectEntity),
          useValue: projectRepository,
        },
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: taskRepository,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should create a project from the provided data', async () => {
    const dto = { nombre: 'Proyecto A', descripcion: 'Demo' };
    const createdProject = { id: 1, ...dto };

    projectRepository.create.mockReturnValue(createdProject);
    projectRepository.save.mockResolvedValue(createdProject);

    await expect(service.create(dto)).resolves.toEqual(createdProject);
    expect(projectRepository.create).toHaveBeenCalledWith(expect.objectContaining(dto));
    expect(projectRepository.save).toHaveBeenCalledWith(createdProject);
  });

  it('should return tasks for a project', async () => {
    const tasks = [{ id: 10, titulo: 'Tarea 1' }];

    projectRepository.findOneBy.mockResolvedValue({ id: 7 });
    taskRepository.find.mockResolvedValue(tasks);

    await expect(service.getProjectTasks(7)).resolves.toEqual(tasks);
    expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id: 7 });
    expect(taskRepository.find).toHaveBeenCalledWith({ where: { projectId: 7 } });
  });
});
