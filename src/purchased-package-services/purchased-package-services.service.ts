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

    const serviceIds: string[] = [];

    // Single service
    if (dto.serviceId) {
      serviceIds.push(dto.serviceId);
    }

    // Multiple services
    if (dto.serviceIds?.length) {
      serviceIds.push(...dto.serviceIds);
    }

    if (serviceIds.length === 0) {
      throw new BadRequestException(
        'Please provide serviceId or serviceIds',
      );
    }

    const usedServices: {
      id: string;
      serviceName: string;
      usedAt: Date;
    }[] = [];

    for (const serviceId of serviceIds) {

      const item =
        await this.purchasedPackageServiceRepo.findOne({
          where: {
            purchasedPackage: {
              id: dto.purchasedPackageId,
            },
            service: {
              id: serviceId,
            },
          },
          relations: {
            service: true,
            purchasedPackage: true,
          },
        });

      if (!item) {
        throw new BadRequestException(
          `Service ${serviceId} not found in package`,
        );
      }

      if (
        item.purchasedPackage.expiryDate &&
        item.purchasedPackage.expiryDate < new Date()
      ) {
        throw new BadRequestException(
          'Package has expired',
        );
      }

      if (item.isUsed) {
        throw new BadRequestException(
          `${item.service.serviceName} already used`,
        );
      }

      item.isUsed = true;
      item.usedAt = new Date();

      await this.purchasedPackageServiceRepo.save(
        item,
      );

      usedServices.push({
        id: item.service.id,
        serviceName: item.service.serviceName,
        usedAt: item.usedAt,
      });
    }

    return {
      success: true,
      message: 'Service(s) used successfully',
      services: usedServices,
    };
  }
}
