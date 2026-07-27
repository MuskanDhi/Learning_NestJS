import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Branch } from 'src/branches/entities/branch.entity';
import { CreatePurchasedOrderDto } from './dto/create-purchased-order.dto';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { PurchasedOrder } from './entities/purchased-order.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';

@Injectable()
export class PurchasedOrderService {
  constructor(
    @InjectRepository(PurchasedOrder)
    private readonly purchasedOrderRepo: Repository<PurchasedOrder>,

    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,

    @InjectRepository(Branch)
    private readonly branchRepo: Repository<Branch>,

    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,
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

    if (!dto.vendorId) {
      throw new BadRequestException('vendorId is required');
    }

    const vendor = await this.vendorRepo.findOne({
      where: {
        id: dto.vendorId,
      },
    });

    if (!vendor) {
      throw new BadRequestException('Vendor not found');
    }

    const purchasedOrder =
      this.purchasedOrderRepo.create({
        createdBy: dto.createdBy,
        orderedQuantity: dto.orderedQuantity,
        status: 'ORDERED', // default status
        item,
        itemName: item.itemName,
        branch,
        vendor,
      });

    await this.purchasedOrderRepo.save(
      purchasedOrder,
    );

    return {
      message: 'Purchased order created successfully',
      purchasedOrder,
    };
  }

  // async findOne(
  //   branchId: string,
  //   purchasedOrderId: string,
  // ) {
  //   const purchasedOrder =
  //     await this.purchasedOrderRepo.findOne({
  //       where: {
  //         id: purchasedOrderId,
  //         branch: {
  //           id: branchId,
  //         },
  //       },
  //       relations: {
  //         item: true,
  //         branch: true,
  //       },
  //     });

  //   if (!purchasedOrder) {
  //     throw new NotFoundException(
  //       'Purchased order not found',
  //     );
  //   }

  //   return {
  //     id: purchasedOrder.id,
  //     itemName: purchasedOrder.item.itemName,
  //     orderedQuantity:
  //       purchasedOrder.orderedQuantity,
  //   };
  // }

  async findAll(branchId: string) {
    return this.purchasedOrderRepo.find({
      where: {
        branch: {
          id: branchId,
        },
      },
      relations: {
        branch: true,
      },
    });
  }

  // async update(
  //   id: string,
  //   dto: Partial<CreatePurchasedOrderDto>,
  // ){
  //   const item =
  //   await this.purchasedOrderRepo.findOne({
  //     where: { id },
  //   });

  //   if(!item) {
  //     throw new NotFoundException(
  //       'Purchased Order not found',
  //     );
  //   }

  //   Object.assign(item, dto);

  //   return this.purchasedOrderRepo.save(item);
  // }

  // async remove(
  //   id: string,
  // ){
  //   const item =
  //     await this.purchasedOrderRepo.findOne({
  //       where: { id },
  //     });

  //     if(!item) {
  //       throw new NotFoundException(
  //         'Purchased Order not found',
  //       );
  //     }

  //     await this.purchasedOrderRepo.remove(item);

  //     return {
  //       message:
  //       'Purchased Order deleted successfully',
  //     };
  // }
}