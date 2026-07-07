import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Branch } from 'src/branches/entities/branch.entity';
import { CreatePurchasedOrderDto } from './dto/create-purchased-order.dto';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { PurchasedOrder } from './entities/purchased-order.entity';

@Injectable()
export class PurchasedOrderService {
  constructor(
    @InjectRepository(PurchasedOrder)
    private readonly purchasedOrderRepo: Repository<PurchasedOrder>,

    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,

    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,
  ) { }

  async create(
    branchId: string,
    dto: CreatePurchasedOrderDto,
  ) {
    const branch = await this.branchRepo.findOne({
      where: {
        id: branchId,
      },
    });

    if (!branch) {
      throw new NotFoundException(
        'Branch not found',
      );
    }

    const item = await this.inventoryRepo.findOne({
      where: {
        id: dto.itemId,
      },
    });

    if (!item) {
      throw new NotFoundException(
        'Inventory item not found',
      );
    }

    const purchasedOrder =
      this.purchasedOrderRepo.create({
        createdBy: dto.createdBy,
        orderedQuantity: dto.orderedQuantity,
        status: 'ORDERED', // default status
        item,
        itemName: item.itemName,
        branch,
      });

    await this.purchasedOrderRepo.save(
      purchasedOrder,
    );

    return {
      message: 'Purchased order created successfully',
      purchasedOrder,
    };
  }

  async findOne(
    branchId: string,
    purchasedOrderId: string,
  ) {
    const purchasedOrder =
      await this.purchasedOrderRepo.findOne({
        where: {
          id: purchasedOrderId,
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

    return {
      id: purchasedOrder.id,
      itemName: purchasedOrder.item.itemName,
      orderedQuantity:
        purchasedOrder.orderedQuantity,
    };
  }
}