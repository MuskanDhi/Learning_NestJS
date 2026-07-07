import { Module } from '@nestjs/common';
import { GoodReceiptNoteService } from './good_receipt_note.service';
import { GoodReceiptNoteController } from './good_receipt_note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsReceiptNote } from './entities/good_receipt_note.entity';
import { PurchasedOrder } from 'src/purchased-order/entities/purchased-order.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, PurchasedOrder, GoodsReceiptNote, InventoryItem]),
  ],
  controllers: [GoodReceiptNoteController],
  providers: [GoodReceiptNoteService],
})
export class GoodReceiptNoteModule { }
