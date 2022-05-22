import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MeetStatus } from '../enum/meet-status.enum';

@Entity()
export class Meet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public status: MeetStatus;

  @Column()
  public start: Date;

  @Column()
  public end: Date;

  @Column()
  public seats: number;

  @Column()
  public available_seats: number;
}
