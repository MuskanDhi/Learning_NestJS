import { Module } from '@nestjs/common';
import { PurchasedDealServicesService } from './purchased-deal-services.service';
import { PurchasedDealServicesController } from './purchased-deal-services.controller';
import { PurchasedDeal } from 'src/purchased-deals/entities/purchased-deal.entity';
import { TeamMember } from 'src/team-members/entities/team-member.entity';
import { PurchasedDealService } from './entities/purchased-deal-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchasedDealService, PurchasedDeal, TeamMember]),
  ],
  controllers: [PurchasedDealServicesController],
  providers: [PurchasedDealServicesService],
})
export class PurchasedDealServicesModule {}
