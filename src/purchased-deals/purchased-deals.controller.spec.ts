import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedDealsController } from './purchased-deals.controller';
import { PurchasedDealsService } from './purchased-deals.service';

describe('PurchasedDealsController', () => {
  let controller: PurchasedDealsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasedDealsController],
      providers: [PurchasedDealsService],
    }).compile();

    controller = module.get<PurchasedDealsController>(PurchasedDealsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('purchased_deals')
export class PurchasedDeal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    dealId: string;

    @Column({ unique: true })
    paymentId: string;

    @Column({
        default: 'SUCCESS',
    })
    status: string;

    @CreateDateColumn()
    purchasedAt: Date;
}