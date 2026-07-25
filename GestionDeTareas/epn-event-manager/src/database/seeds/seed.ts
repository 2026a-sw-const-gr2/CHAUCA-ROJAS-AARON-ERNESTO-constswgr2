import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { ProjectEntity } from '../entities/project.entity';
import { TaskEntity } from '../entities/task.entity';

async function bootstrap() {
  await AppDataSource.initialize();

  const projectRepository = AppDataSource.getRepository(ProjectEntity);
  const taskRepository = AppDataSource.getRepository(TaskEntity);

  const existingProjects = await projectRepository.count();
  const existingTasks = await taskRepository.count();

  if (existingProjects === 0) {
    const projects = await projectRepository.save([
      projectRepository.create({
        nombre: 'Proyecto Alpha',
        descripcion: 'Proyecto de prueba inicial',
      }),
      projectRepository.create({
        nombre: 'Proyecto Beta',
        descripcion: 'Segundo proyecto de prueba',
      }),
    ]);

    if (existingTasks === 0) {
      await taskRepository.save([
        taskRepository.create({
          titulo: 'Tarea 1',
          descripcion: 'Tarea de prueba 1',
          estado: 'pendiente',
          fecha_creacion: new Date().toISOString(),
          responsable: 'Ana',
          projectId: projects[0].id,
        }),
        taskRepository.create({
          titulo: 'Tarea 2',
          descripcion: 'Tarea de prueba 2',
          estado: 'en progreso',
          fecha_creacion: new Date().toISOString(),
          responsable: 'Luis',
          projectId: projects[0].id,
        }),
        taskRepository.create({
          titulo: 'Tarea 3',
          descripcion: 'Tarea de prueba 3',
          estado: 'completada',
          fecha_creacion: new Date().toISOString(),
          responsable: 'Marta',
          projectId: projects[1].id,
        }),
        taskRepository.create({
          titulo: 'Tarea 4',
          descripcion: 'Tarea de prueba 4',
          estado: 'pendiente',
          fecha_creacion: new Date().toISOString(),
          responsable: 'Juan',
          projectId: projects[1].id,
        }),
        taskRepository.create({
          titulo: 'Tarea 5',
          descripcion: 'Tarea de prueba 5',
          estado: 'en progreso',
          fecha_creacion: new Date().toISOString(),
          responsable: 'Sofía',
        }),
      ]);
    }
  }

  await AppDataSource.destroy();
}

bootstrap().catch((error) => {
  console.error('Seed failed', error);
  process.exitCode = 1;
});
