import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryItemsService } from './inventory-items.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Controller('branches/:branchId/inventory-items')
export class InventoryItemsController {
  constructor(
    private readonly inventoryService: InventoryItemsService,
  ) {}

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

  @Get()
  findAll(
    @Param('branchId') branchId: string,
  ) {
    return this.inventoryService.findAll(
      branchId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateInventoryItemDto>,
  ) {
    return this.inventoryService.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.inventoryService.remove(id);
  }
}
