import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchasedOrder } from 'src/purchased-order/entities/purchased-order.entity';
import { Repository } from 'typeorm';
import { GoodsReceiptNote } from './entities/good_receipt_note.entity';
import { CreateGoodsReceiptNoteDto } from './dto/create-good_receipt_note.dto';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';

@Injectable()
export class GoodReceiptNoteService {
  constructor(
    @InjectRepository(PurchasedOrder)
    private purchasedOrderRepo: Repository<PurchasedOrder>,
    @InjectRepository(GoodsReceiptNote)
    private grnRepo: Repository<GoodsReceiptNote>,
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
  ) { }
  async create(
    branchId: string,
    dto: CreateGoodsReceiptNoteDto,
  ) {

    const purchasedOrder =
      await this.purchasedOrderRepo.findOne({
        where: {
          id: dto.purchasedOrderId,
          branch: {
            id: branchId,
          },
        },
        relations: {
          item: true,
          branch: true,
        },
      });

    if (!purchasedOrder) {
      throw new NotFoundException(
        'Purchased order not found',
      );
    }

    const previousReceipts =
      await this.grnRepo.find({
        where: {
          purchasedOrder: {
            id: purchasedOrder.id,
          },
        },
      });

    const totalReceived = await this.grnRepo
      .createQueryBuilder('grn')
      .select('SUM(grn.receivedQuantity)', 'total')
      .where('grn.purchasedOrderId = :id', {
        id: purchasedOrder.id,
      })
      .getRawOne();

    const alreadyReceived =
      Number(totalReceived.total) || 0;

    const remaining =
      purchasedOrder.orderedQuantity -
      alreadyReceived;

    if (dto.receivedQuantity > remaining) {
      throw new ConflictException(
        `Only ${remaining} units are remaining for this item.`,
      );
    }

    const grn = this.grnRepo.create({
      purchasedOrder,
      receivedBy: dto.receivedBy,
      itemName: purchasedOrder.itemName,
      orderedQuantity:
        purchasedOrder.orderedQuantity,
      receivedQuantity:
        dto.receivedQuantity,
    });

    await this.grnRepo.save(grn);

    const newTotalReceived =
      alreadyReceived + dto.receivedQuantity;

    if (
      newTotalReceived ===
      purchasedOrder.orderedQuantity
    ) {
      purchasedOrder.status =
        'CONVERTED_TO_GRN';
    } else {
      purchasedOrder.status =
        'PARTIALLY RECEIVED';
    }

    await this.purchasedOrderRepo.save(
      purchasedOrder,
    );

    const inventoryItem = purchasedOrder.item;

    inventoryItem.stockLevel =
      Number(inventoryItem.stockLevel) +
      Number(dto.receivedQuantity);

    await this.inventoryRepository.save(inventoryItem);


    return {
      message:
        'Goods Receipt Note created successfully',
      grn,
    };
  }
}

