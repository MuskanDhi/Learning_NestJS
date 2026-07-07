import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { PurchasedOrderService } from './purchased-order.service';
import { CreatePurchasedOrderDto } from './dto/create-purchased-order.dto';

@Controller('branches/:branchId/purchased-orders')
export class PurchasedOrderController {
  constructor(
    private readonly purchasedOrderService: PurchasedOrderService,
  ) { }

  @Post()
  create(
    @Param('branchId') branchId: string,
    @Body() dto: CreatePurchasedOrderDto,
  ) {
    return this.purchasedOrderService.create(
      branchId,
      dto,
    );
  }

  @Get(':purchasedOrderId')
  findOne(
    @Param('branchId') branchId: string,
    @Param('purchasedOrderId') purchasedOrderId: string,
  ) {
    return this.purchasedOrderService.findOne(
      branchId,
      purchasedOrderId,
    );
  }
}