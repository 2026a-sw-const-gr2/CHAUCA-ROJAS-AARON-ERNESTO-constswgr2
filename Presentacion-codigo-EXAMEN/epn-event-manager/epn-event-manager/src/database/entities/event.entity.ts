import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum EventAction {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
  Query = 'QUERY',
}

@Entity('events')
@Index('idx_events_source', ['source'])
@Index('idx_events_entity', ['entity'])
@Index('idx_events_created_at', ['created_at'])
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  source: string;

  @Column()
  entity: string;

  @Column({ type: 'text' })
  action: EventAction;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text' })
  payload: string;

  @Column({ type: 'text' })
  created_at: string;
}
