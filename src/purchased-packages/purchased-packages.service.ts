import { BadRequestException, Injectable } from '@nestjs/common';
import { BuyPackageDto } from './dto/create-purchased-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from 'src/packages/entities/package.entity';
import { Repository } from 'typeorm';
import { PurchasedPackage } from './entities/purchased-package.entity';
import { PurchasedPackageService } from 'src/purchased-package-services/entities/purchased-package-service.entity';

@Injectable()
export class PurchasedPackagesService {
  constructor(

    @InjectRepository(PurchasedPackage)
    private purchasedPackageRepo: Repository<PurchasedPackage>,

    @InjectRepository(Package)
    private packageRepo: Repository<Package>,

    @InjectRepository(PurchasedPackageService)
    private purchasedPackageServiceRepo: Repository<PurchasedPackageService>,
  ) { }
  async buyPackage(
    branchId: string,
    dto: BuyPackageDto,
  ) {

    const pkg =
      await this.packageRepo.findOne({
        where: {
          id: dto.packageId,
          branch: {
            id: branchId,
          },
        },
        relations: {
          branch: true,
          services: true,
        },
      });

    if (!pkg) {
      throw new BadRequestException(
        'Package not found',
      );
    }

    if (pkg.branch.id !== branchId) {
      throw new Error(`Package with ID ${dto.packageId} does not belong to branch ${branchId}`);
    }

    const expiryDate = new Date();

    if (pkg.unit === 'day') {
      expiryDate.setDate(
        expiryDate.getDate() +
        Number(pkg.duration),
      );
    }

    if (pkg.unit === 'month') {
      expiryDate.setMonth(
        expiryDate.getMonth() +
        Number(pkg.duration),
      );
    }

    if (pkg.unit === 'year') {
      expiryDate.setFullYear(
        expiryDate.getFullYear() +
        Number(pkg.duration),
      );
    }

    const purchased =
      await this.purchasedPackageRepo.save(
        this.purchasedPackageRepo.create({
          package: pkg,
          branch: pkg.branch,
          expiryDate,
        }),
      );

    for (const service of pkg.services) {

      await this.purchasedPackageServiceRepo.save(
        this.purchasedPackageServiceRepo.create({
          purchasedPackage: purchased,
          service,
        }),
      );
    }

    return {
      message:
        'Package purchased successfully',
      purchased,
    };
  }
}