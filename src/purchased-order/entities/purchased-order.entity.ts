import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';

import { Branch } from 'src/branches/entities/branch.entity';
import { InventoryItem } from 'src/inventory-items/entities/inventory-item.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';

@Entity('purchased_orders')
export class PurchasedOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Branch, (branch) => branch.purchasedOrders, {
        onDelete: 'CASCADE',
    })
    branch: Branch;

    @Column()
    createdBy: string;

    @ManyToOne(() => InventoryItem)
    item: InventoryItem;

    @Column()
    itemName: string;

    @Column('int')
    orderedQuantity: number;

    @Column({
        type: 'enum',
        enum: ['ORDERED', 'CONVERTED_TO_GRN', 'PARTIALLY RECEIVED'],
        default: 'ORDERED',
    })
    status: string;

    @ManyToOne(() => Vendor, (vendor) => vendor.purchasedOrders, {
        onDelete: 'CASCADE',
    })
    vendor: Vendor;

    @CreateDateColumn()
    createdAt: Date;
}