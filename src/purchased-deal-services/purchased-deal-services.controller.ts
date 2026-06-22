import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasedDealServicesService } from './purchased-deal-services.service';
import { CreatePurchasedDealServiceDto } from './dto/create-purchased-deal-service.dto';

@Controller('purchased-deal-services')
export class PurchasedDealServicesController {
  constructor(private readonly purchasedDealServicesService: PurchasedDealServicesService) {}

  @Post(':branchId/use')
  useService(
    @Param('branchId') branchId: string,
    @Body() dto: CreatePurchasedDealServiceDto,
  ) {
    return this.purchasedDealServicesService.useService(branchId, dto);
  }
}
