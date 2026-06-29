import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AddServicesIntoCartService } from './add-services-into-cart.service';
import { CreateAddServicesIntoCartDto } from './dto/create-add-services-into-cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SelectSlotDto } from './dto/select-slot.dto';

@Controller('add-services-into-cart')
export class AddServicesIntoCartController {
  constructor(private readonly addServicesIntoCartService: AddServicesIntoCartService) { }

  @Post(':branchId')
  @UseGuards(JwtAuthGuard)
  addServiceToCart(
    @Param('branchId') branchId: string,
    @Body() dto: CreateAddServicesIntoCartDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.addServicesIntoCartService.addServiceToCart(
      branchId,
      req.user.id,
      dto,
    );
  }

  @Get(':branchId')
  @UseGuards(JwtAuthGuard)
  getCart(@Param('branchId') branchId: string, @Req() req) {
    const userId = req.user.id;
    return this.addServicesIntoCartService.getCart(branchId, userId);
  }

  @Post(':cartId/select-slot')
  selectSlot(
    @Param('cartId') cartId: string,
    @Body() dto: SelectSlotDto,
  ) {
    return this.addServicesIntoCartService.selectSlot(
      cartId,
      dto,
    );
  }
}