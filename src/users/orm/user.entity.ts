import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserGender } from '../enum/user-gender.enum';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;

  @Column({ select: false, unique: true })
  public email: string;

  @Column({ unique: true })
  public username: string;

  @Column({ select: false })
  public password: string;

  @Column({ select: false })
  public salt: string;

  @Column({ nullable: false, default: false })
  public active: boolean;

  @Column({ nullable: true })
  public lastSuccessfullLogin: Date;

  @Column({ nullable: true })
  public avatar: string;

  @Column({ nullable: true })
  public birth: Date;

  @Column({ nullable: true })
  public gender: UserGender;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
