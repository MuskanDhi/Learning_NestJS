import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Deal } from 'src/deals/entities/deal.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Entity('purchased_deals')
export class PurchasedDeal {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Deal, {
    eager: true,
    onDelete: 'CASCADE',
  })
  deal: Deal;

  @ManyToOne(() => Branch, {
    eager: true,
    onDelete: 'CASCADE',
  })
  branch: Branch;

  @Column({ unique: true })
  paymentId: string;

  @Column({
    default: 'SUCCESS',
  })
  status: string;

  @CreateDateColumn()
  purchasedAt: Date;
}