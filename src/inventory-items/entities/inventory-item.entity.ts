import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Branch } from 'src/branches/entities/branch.entity';

@Entity('inventory_items')
export class InventoryItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    itemName: string;

    @Column()
    brand: string;

    @Column('int')
    stockLevel: number;

    @Column('decimal', {
        precision: 10,
        scale: 2,
    })
    costPerUnit: number;

    @ManyToOne(
        () => Branch,
        (branch) => branch.inventoryItems,
        {
            onDelete: 'CASCADE',
        },
    )
    branch: Branch;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}