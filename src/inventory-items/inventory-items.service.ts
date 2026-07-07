import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';

@Injectable()
export class InventoryItemsService {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,

    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
  ) { }
  async create(
    branchId: string,
    dto: CreateInventoryItemDto,
  ) {
    const branch =
      await this.branchRepository.findOne({
        where: {
          id: branchId,
        },
      });

    if (!branch) {
      throw new NotFoundException(
        'Branch not found',
      );
    }

    const item =
      this.inventoryRepository.create({
        ...dto,
        branch,
      });

    await this.inventoryRepository.save(item);

    return {
      message:
        'Inventory item created successfully',
      item,
    };
  }


  async findAll(branchId: string) {
    return this.inventoryRepository.find({
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

  async update(
    id: string,
    dto: Partial<CreateInventoryItemDto>,
  ) {
    const item =
      await this.inventoryRepository.findOne({
        where: { id },
      });

    if (!item) {
      throw new NotFoundException(
        'Inventory item not found',
      );
    }

    Object.assign(item, dto);

    return this.inventoryRepository.save(item);
  }


  async remove(id: string) {
    const item =
      await this.inventoryRepository.findOne({
        where: { id },
      });

    if (!item) {
      throw new NotFoundException(
        'Inventory item not found',
      );
    }

    await this.inventoryRepository.remove(item);

    return {
      message:
        'Inventory item deleted successfully',
    };
  }
}
