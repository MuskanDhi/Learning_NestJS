import { BadRequestException, Injectable } from '@nestjs/common';
import { BuyDealDto } from './dto/create-purchased-deal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from 'src/deals/entities/deal.entity';
import { Repository } from 'typeorm';
import { PurchasedDeal } from './entities/purchased-deal.entity';

@Injectable()
export class PurchasedDealsService {
  constructor(
    @InjectRepository(PurchasedDeal)
    private purchasedDealRepo:
      Repository<PurchasedDeal>,

    @InjectRepository(Deal)
    private dealRepo:
      Repository<Deal>,

  ) { }
  async buyDeal(
    branchId: string,
    dto: BuyDealDto,
  ) {

    const deal =
      await this.dealRepo.findOne({
        where: {
          id: dto.dealId,
          branch: {
            id: branchId,
          },
        },
        relations: {
          branch: true,
        },
      });

    if (!deal) {
      throw new BadRequestException(
        'Deal not found',
      );
    }
    if (deal.branch.id !== branchId) {
      throw new Error(`Deal with ID ${dto.dealId} does not belong to branch ${branchId}`);
    }

    const purchasedDeal =
      this.purchasedDealRepo.create({
        deal,
        branch: deal.branch,
        purchasedAt: new Date(),
        expiryDate: new Date(deal.endDate),
        status: 'active',
      });

    await this.purchasedDealRepo.save(
      purchasedDeal,
    );

    return {
      message:
        'Deal purchased successfully',
      purchasedDeal,
    };
  }

  // findAll() {
  //   return `This action returns all purchasedDeals`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} purchasedDeal`;
  // }

  // update(id: number, updatePurchasedDealDto: UpdatePurchasedDealDto) {
  //   return `This action updates a #${id} purchasedDeal`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} purchasedDeal`;
  // }
}
