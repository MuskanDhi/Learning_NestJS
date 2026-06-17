import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Column,
    OneToMany,
} from 'typeorm';

import { Package } from 'src/packages/entities/package.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { PurchasedPackageService } from 'src/purchased-package-services/entities/purchased-package-service.entity';

@Entity('purchased_packages')
export class PurchasedPackage {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Package,
        { eager: true },
    )
    package: Package;

    @ManyToOne(
        () => Branch,
        { eager: true },
    )
    branch: Branch;

    @CreateDateColumn()
    purchaseDate: Date;

    @Column()
    expiryDate: Date;

    @Column({
        default: 'active',
    })
    status: string;

    @OneToMany(
        () => PurchasedPackageService,
        item => item.purchasedPackage,
        {
            cascade: true,
        },
    )
    services: PurchasedPackageService[];
}