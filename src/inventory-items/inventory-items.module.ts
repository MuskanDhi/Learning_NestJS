import { Module } from '@nestjs/common';
import { InventoryItemsService } from './inventory-items.service';
import { InventoryItemsController } from './inventory-items.controller';
import { InventoryItem } from './entities/inventory-item.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
      TypeOrmModule.forFeature([Branch, InventoryItem]),
    ],
  controllers: [InventoryItemsController],
  providers: [InventoryItemsService],
})
export class InventoryItemsModule {}
