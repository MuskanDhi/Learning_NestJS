import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Controller('branches/:branchId/vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}
  
  @Post()
  create(
    @Param('branchId') branchId: string,
    @Body() dto: CreateVendorDto,
  ) {
    return this.vendorsService.create(branchId, dto);
  }

  @Get()
  findAll(
    @Param('branchId') branchId: string,
  ) {
    return this.vendorsService.findAll(branchId);
  }
}
