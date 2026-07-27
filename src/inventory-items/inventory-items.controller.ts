import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InventoryItemsService } from './inventory-items.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('branches/:branchId/inventoryItems')
export class InventoryItemsController {
  constructor(
    private readonly inventoryService: InventoryItemsService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('branchId') branchId: string,
    @Body() dto: CreateInventoryItemDto,
  ) {
    return this.inventoryService.create(
      branchId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Param('branchId') branchId: string,
  ) {
    return this.inventoryService.findAll(
      branchId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':inventoryItemId')
  update(
    @Param('inventoryItemId') inventoryItemId: string,
    @Body() dto: Partial<CreateInventoryItemDto>,
  ) {
    return this.inventoryService.update(
      inventoryItemId,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':inventoryItemId')
  remove(
    @Param('inventoryItemId') inventoryItemId: string,
  ) {
    return this.inventoryService.remove(inventoryItemId);
  }
}
