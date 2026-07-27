import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('branches/:branchId/vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) { }

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

  @UseGuards(JwtAuthGuard)
  @Patch(':vendorId')
  update(
    @Param('vendorId') vendorId: string,
    @Body() body,
    @Req() req
  ) {
    return this.vendorsService.update(
      vendorId,
      body,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':vendorId')
  remove(
    @Param('vendorId') vendorId: string,
    @Req() req,
  ) {
    return this.vendorsService.remove(
      vendorId,
      req.user.id,
    )
  }
}
