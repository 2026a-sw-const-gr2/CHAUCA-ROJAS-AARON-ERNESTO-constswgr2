import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Column({ default: 'pendiente' })
  estado!: string;

  @Column()
  fecha_creacion!: string;

  @Column({ nullable: true })
  responsable!: string;

  @Column({ nullable: true })
  projectId!: number;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks, {
    nullable: true,
  })
  project!: ProjectEntity;
}
