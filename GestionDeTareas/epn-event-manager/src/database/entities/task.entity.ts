import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

<<<<<<< HEAD
  @Column({ nullable: true })
  responsable!: string;
=======
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
>>>>>>> 07138990f8171950137a2e92852f999618399d01
}
