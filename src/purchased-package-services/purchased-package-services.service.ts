import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreatePurchasedPackageServiceDto } from './dto/create-purchased-package-service.dto';
import { PurchasedPackageService } from './entities/purchased-package-service.entity';
import { PurchasedPackage } from 'src/purchased-packages/entities/purchased-package.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PurchasedPackageServicesService {
  constructor(
    @InjectRepository(PurchasedPackageService)
    private purchasedPackageServiceRepo: Repository<PurchasedPackageService>,

    @InjectRepository(PurchasedPackage)
    private purchasedPackageRepo: Repository<PurchasedPackage>,
  ) { }

  async useService(
    branchId: string,
    dto: CreatePurchasedPackageServiceDto,
  ) {
    const purchasedPackage =
      await this.purchasedPackageRepo.findOne({
        where: {
          id: dto.purchasedPackageId,
          branch: {
            id: branchId,
          },
        },
        relations: {
          branch: true,
        },
      });

    if (!purchasedPackage) {
      throw new BadRequestException(
        'Purchased package not found for this branch',
      );
    }

    const serviceIds: string[] = [];

    if (dto.serviceId) {
      serviceIds.push(dto.serviceId);
    }

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
      teamMemberId: string;
      startTime: string;
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

      // If you added these columns in entity
      // item.teamMemberId = dto.teamMemberId;
      // item.startTime = new Date(dto.startTime);

      await this.purchasedPackageServiceRepo.save(
        item,
      );

      usedServices.push({
        id: item.service.id,
        serviceName: item.service.serviceName,
        teamMemberId: dto.teamMemberId,
        startTime: dto.startTime,
        usedAt: item.usedAt,
      });
    }

    return {
      success: true,
      branchId,
      purchasedPackageId:
        dto.purchasedPackageId,
      teamMemberId: dto.teamMemberId,
      startTime: dto.startTime,
      message:
        'Service(s) used successfully',
      services: usedServices,
    };
  }
}