import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { Salon } from '../../salons/entities/salon.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column()
  // firstName: string;

  // @Column()
  // lastName: string;
  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @OneToMany(() => Salon, (salon) => salon.user)
  salons: Salon[];
}
