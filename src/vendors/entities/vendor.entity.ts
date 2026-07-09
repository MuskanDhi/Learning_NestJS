import { Branch } from "src/branches/entities/branch.entity";
import { PurchasedOrder } from "src/purchased-order/entities/purchased-order.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('vendors')
export class Vendor {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Branch,
        (branch) => branch.vendors,
        {
            onDelete: 'CASCADE',
        },
    )
    branch: Branch;

    @Column({
        nullable: false,
    })
    vendorName: string;

    @Column({
        unique: true,
        nullable: false,
    })
    vendorPhone: string;

    @Column({
        unique: true,
        nullable: false,
    })
    vendorEmail: string;

    @OneToMany(() => PurchasedOrder, (purchasedOrder) => purchasedOrder.vendor)
    purchasedOrders: PurchasedOrder[];
}