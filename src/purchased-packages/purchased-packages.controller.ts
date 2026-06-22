import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasedPackagesService } from './purchased-packages.service';

@Controller('purchased-packages')
export class PurchasedPackagesController {
  constructor(private readonly purchasedPackagesService: PurchasedPackagesService) { }
  
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
