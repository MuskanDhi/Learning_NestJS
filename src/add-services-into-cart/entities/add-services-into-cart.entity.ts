import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Column,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Service } from 'src/services/entities/services.entity';
import { Package } from 'src/packages/entities/package.entity';
import { Deal } from 'src/deals/entities/deal.entity';

@Entity('cart')
export class Cart {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => User,
        {
            eager: true,
            onDelete: 'CASCADE',
        },
    )
    user: User;

    @ManyToOne(
        () => Branch,
        {
            eager: true,
            onDelete: 'CASCADE',
        },
    )
    branch: Branch;

    @Column()
    type: string;

    @ManyToOne(
        () => Service,
        {
            nullable: true,
            eager: true,
        },
    )
    service?: Service;

    @ManyToOne(
        () => Package,
        {
            nullable: true,
            eager: true,
        },
    )
    package?: Package;

    @ManyToOne(
        () => Deal,
        {
            nullable: true,
            eager: true,
        },
    )
    deal?: Deal;

    @CreateDateColumn()
    createdAt: Date;
}