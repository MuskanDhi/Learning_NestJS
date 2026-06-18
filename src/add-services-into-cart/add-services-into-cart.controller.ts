import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AddServicesIntoCartService } from './add-services-into-cart.service';
import { CreateAddServicesIntoCartDto } from './dto/create-add-services-into-cart.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('add-services-into-cart')
export class AddServicesIntoCartController {
  constructor(private readonly addServicesIntoCartService: AddServicesIntoCartService) {}
  
  @Post(':branchId')
  @UseGuards(JwtAuthGuard)
  addServiceToCart(
    @Param('branchId') branchId: string,
    @Body() dto: CreateAddServicesIntoCartDto,
    @Req() req,
  ) {
    const userId = req.user.id; // Assuming the user ID is stored in the JWT payload
    return this.addServicesIntoCartService.addServiceToCart(
    branchId,
    req.user.id,
    dto,
    );
  }
}