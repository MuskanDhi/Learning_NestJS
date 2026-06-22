import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Package } from 'src/packages/entities/package.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { PurchasedPackageService } from 'src/purchased-package-services/entities/purchased-package-service.entity';

@Entity('purchased_packages')
export class PurchasedPackage {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, {
        eager: true,
        onDelete: 'CASCADE',
    })
    user: User;

    @ManyToOne(() => Package, {
        eager: true,
        onDelete: 'CASCADE',
    })
    package: Package;

    @ManyToOne(() => Branch, {
        eager: true,
        onDelete: 'CASCADE',
    })
    branch: Branch;

    @OneToMany(
        () => PurchasedPackageService,
        purchasedPackageService =>
            purchasedPackageService.purchasedPackage,
    )
    services: PurchasedPackageService[];

    @Column({ unique: true })
    paymentId: string;

    @Column({
        default: 'SUCCESS',
    })
    status: string;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    expiryDate: Date;

    @CreateDateColumn()
    purchasedAt: Date;
}