import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasedDealsService } from './purchased-deals.service';
import { BuyDealDto } from './dto/create-purchased-deal.dto';

@Controller('purchased-deals')
export class PurchasedDealsController {
  constructor(private readonly purchasedDealsService: PurchasedDealsService) { }

  @Post(':branchId/buy')
  buyDeal(
    @Param('branchId')
    branchId: string,

    @Body()
    dto: BuyDealDto,
  ) {
    return this.purchasedDealsService.buyDeal(branchId, dto);
  }

  // @Get()
  // findAll() {
  //   return this.purchasedDealsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.purchasedDealsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePurchasedDealDto: UpdatePurchasedDealDto) {
  //   return this.purchasedDealsService.update(+id, updatePurchasedDealDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.purchasedDealsService.remove(+id);
  // }
}
