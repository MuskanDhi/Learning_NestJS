import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PurchasedOrderService } from './purchased-order.service';
import { CreatePurchasedOrderDto } from './dto/create-purchased-order.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('branches/:branchId/purchasedOrders')
export class PurchasedOrderController {
  constructor(
    private readonly purchasedOrderService: PurchasedOrderService,
  ) { }

  @UseGuards(JwtAuthGuard)
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

  // @Get(':purchasedOrderId')
  // findOne(
  //   @Param('branchId') branchId: string,
  //   @Param('purchasedOrderId') purchasedOrderId: string,
  // ) {
  //   return this.purchasedOrderService.findOne(
  //     branchId,
  //     purchasedOrderId,
  //   );
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param('branchId') branchId: string,
  ) {
    return this.purchasedOrderService.findAll(
      branchId,
    );
  }

  // @UseGuards(JwtAuthGuard)
  // @Patch(':purchasedOrderId')
  // update(
  //   @Param('purchasedOrderId') purchasedOrderId: string,
  //   @Body() dto: Partial<CreatePurchasedOrderDto>,
  // ){
  //   return this.purchasedOrderService.update(
  //     purchasedOrderId,
  //     dto,
  //   );
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':purchasedOrderId')
  // remove(
  //   @Param('purchasedOrderId') purchasedOrderId: string,
  // ){
  //   return this.purchasedOrderService.remove(purchasedOrderId);
  // }
}