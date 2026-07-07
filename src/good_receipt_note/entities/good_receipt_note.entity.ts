import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';

import { PurchasedOrder } from 'src/purchased-order/entities/purchased-order.entity';

@Entity('goods_receipt_notes')
export class GoodsReceiptNote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => PurchasedOrder,
        {
            onDelete: 'CASCADE',
        },
    )
    purchasedOrder: PurchasedOrder;

    @Column()
    receivedBy: string;

    @Column()
    itemName: string;

    @Column('int')
    orderedQuantity: number;

    @Column('int')
    receivedQuantity: number;

    @CreateDateColumn()
    createdAt: Date;
}