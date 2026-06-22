import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from 'src/packages/entities/package.entity';
import { Repository } from 'typeorm';
import { PurchasedPackage } from './entities/purchased-package.entity';
import { PurchasedDeal } from 'src/purchased-deals/entities/purchased-deal.entity';

@Injectable()
export class PurchasedPackagesService {
  constructor(

    @InjectRepository(PurchasedPackage)
    private purchasedPackageRepo: Repository<PurchasedPackage>,

    @InjectRepository(PurchasedDeal)
    private purchasedDealRepo:
      Repository<PurchasedDeal>,
  ) { }

  async findByBranch(
    branchId: string,
  ) {

    const purchasedPackages =
      await this.purchasedPackageRepo.find({
        where: {
          branch: {
            id: branchId,
          },
        },
        relations: {
          package: {
            services: true,
          },
          branch: true,
        },
      });

    const purchasedDeals =
      await this.purchasedDealRepo.find({
        where: {
          branch: {
            id: branchId,
          },
        },
        relations: {
          deal: {
            services: true,
          },
          branch: true,
        },
      });

    return {
      purchasedPackages,
      purchasedDeals,
    };
  }
}