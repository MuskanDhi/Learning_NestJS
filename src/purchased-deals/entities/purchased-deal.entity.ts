import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Deal } from 'src/deals/entities/deal.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { PurchasedDealService } from 'src/purchased-deal-services/entities/purchased-deal-service.entity';

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

  @OneToMany(
    () => PurchasedDealService,
    purchasedDealService =>
      purchasedDealService.purchasedDeal,
  )
  services: PurchasedDealService[];

  @Column({ unique: true })
  paymentId: string;

  @Column({
    default: 'SUCCESS',
  })
  status: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  expiryDate: Date;

  @CreateDateColumn()
  purchasedAt: Date;
}