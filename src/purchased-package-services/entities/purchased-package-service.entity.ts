import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PurchasedPackage } from "src/purchased-packages/entities/purchased-package.entity";
import { Service } from "src/services/entities/services.entity";

@Entity('purchased_package_services')
export class PurchasedPackageService {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => PurchasedPackage,
        purchased => purchased.services,
        {
            onDelete: 'CASCADE',
        },
    )
    purchasedPackage: PurchasedPackage;

    @ManyToOne(() => Service)
    service: Service;

    @Column({
        default: false,
    })
    isUsed: boolean;

    @Column({
        nullable: true,
    })
    usedAt: Date;
}