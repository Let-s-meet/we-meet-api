import { User } from 'src/users/orm/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.createdMeets, { eager: false })
  public creator: User;

  @Column()
  public creatorId: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'meet_users' })
  public attendees: User[];
}
