import { Module } from '@nestjs/common';
import { PurchasedDealsService } from './purchased-deals.service';
import { PurchasedDealsController } from './purchased-deals.controller';
import { Branch } from 'src/branches/entities/branch.entity';
import { PurchasedDeal } from './entities/purchased-deal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deal } from 'src/deals/entities/deal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchasedDeal,
      Deal,
      Branch,
    ]),
  ],
  controllers: [PurchasedDealsController],
  providers: [PurchasedDealsService],
  exports: [PurchasedDealsService],
})
export class PurchasedDealsModule { }
