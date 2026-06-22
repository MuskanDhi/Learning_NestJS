import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasedPackageServicesService } from './purchased-package-services.service';
import { CreatePurchasedPackageServiceDto } from './dto/create-purchased-package-service.dto';
@Controller('purchased-package-services')
export class PurchasedPackageServicesController {
  constructor(private readonly purchasedPackageServicesService: PurchasedPackageServicesService) { }

  @Post(':branchId/use')
  useService(
    @Param('branchId') branchId: string,

    @Body()
    dto: CreatePurchasedPackageServiceDto,
  ) {
    return this.purchasedPackageServicesService.useService(
      branchId,
      dto,
    );
  }
}
