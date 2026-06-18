import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasedPackagesService } from './purchased-packages.service';
import { BuyPackageDto } from './dto/create-purchased-package.dto';

@Controller('purchased-packages')
export class PurchasedPackagesController {
  constructor(private readonly purchasedPackagesService: PurchasedPackagesService) { }

  @Post(':branchId/buy')
  buyPackage(
    @Param('branchId')
    branchId: string,

    @Body()
    dto: BuyPackageDto,
  ) {
    return this.purchasedPackagesService.buyPackage(
      branchId,
      dto,
    );
  }
  
  // Get all purchased packages and deals for a specific branch
  @Get(':branchId')
  findByBranch(
    @Param('branchId') branchId: string,
  ) {
    return this.purchasedPackagesService.findByBranch(
      branchId,
    );
  }

}
