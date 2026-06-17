import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePurchasedPackageServiceDto } from './dto/create-purchased-package-service.dto';
import { PurchasedPackageService } from './entities/purchased-package-service.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class PurchasedPackageServicesService {
  constructor(
    @InjectRepository(PurchasedPackageService)
    private purchasedPackageServiceRepo: Repository<PurchasedPackageService>,
  ) { }

  async useService(
    dto: CreatePurchasedPackageServiceDto,
  ) {

    const item =
      await this.purchasedPackageServiceRepo.findOne({
        where: {
          purchasedPackage: {
            id: dto.purchasedPackageId,
          },
          service: {
            id: dto.serviceId,
          },
        },
        relations: {
          service: true,
          purchasedPackage: true,
        },
      });

    if (!item) {
      throw new BadRequestException(
        'Service not found in package',
      );
    }

    if (item.isUsed) {
      throw new BadRequestException(
        'Service already used',
      );
    }

    item.isUsed = true;
    item.usedAt = new Date();

    await this.purchasedPackageServiceRepo.save(
      item,
    );

    if (
      item.purchasedPackage.expiryDate <
      new Date()
    ) {
      throw new BadRequestException(
        'Package has expired',
      );
    }

    return {
      success: true,
      message: 'Service used successfully',
      service: {
        id: item.service.id,
        serviceName: item.service.serviceName,
        usedAt: item.usedAt,
      },
    };
  }
}
