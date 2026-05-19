import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  source!: string;

  @Column({ nullable: true })
  entity!: string;

  @Column({ nullable: true })
  action!: string;

  @Column({ nullable: true })
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ type: 'text', nullable: true })
  payload!: string;

  @Column({ nullable: true })
  query_term!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;
}
