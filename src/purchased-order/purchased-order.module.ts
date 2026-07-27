import { Module } from '@nestjs/common';
import { PurchasedOrderService } from './purchased-order.service';
import { PurchasedOrderController } from './purchased-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { PurchasedOrder } from './entities/purchased-order.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, PurchasedOrder, InventoryItem, Vendor]),AuthModule
  ],
  controllers: [PurchasedOrderController],
  providers: [PurchasedOrderService],
})
export class PurchasedOrderModule { }
