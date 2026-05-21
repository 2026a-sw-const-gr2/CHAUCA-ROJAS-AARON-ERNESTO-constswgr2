import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import type { EventPayload } from '../../modules/events/dto/create-event.dto';

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

  @Column({ type: 'simple-json', nullable: true })
  payload!: EventPayload;

  @Column({ nullable: true })
  query_term!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: string;
}
