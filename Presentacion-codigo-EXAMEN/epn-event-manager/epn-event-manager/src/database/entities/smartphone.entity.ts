import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('smartphones')
export class SmartphoneEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column('real')
  price: number;

  @Column()
  storage: string;

  @Column({ type: 'text' })
  created_at: string;

  @Column({ type: 'text' })
  updated_at: string;
}
