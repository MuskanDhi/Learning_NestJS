// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     ManyToOne,
//     CreateDateColumn,
//     Column,
// } from 'typeorm';

import { Branch } from "src/branches/entities/branch.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { Package } from "src/packages/entities/package.entity";
import { Service } from "src/services/entities/services.entity";
import { TeamMember } from "src/team-members/entities/team-member.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// import { User } from 'src/users/entities/user.entity';
// import { Branch } from 'src/branches/entities/branch.entity';
// import { Service } from 'src/services/entities/services.entity';
// import { Package } from 'src/packages/entities/package.entity';
// import { Deal } from 'src/deals/entities/deal.entity';

// @Entity('cart')
// export class Cart {

//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @ManyToOne(
//         () => User,
//         {
//             eager: true,
//             onDelete: 'CASCADE',
//         },
//     )
//     user: User;

//     @ManyToOne(
//         () => Branch,
//         {
//             eager: true,
//             onDelete: 'CASCADE',
//         },
//     )
//     branch: Branch;

//     @Column()
//     type: string;

//     @ManyToOne(
//         () => Service,
//         {
//             nullable: true,
//             eager: true,
//         },
//     )
//     service?: Service;

//     @ManyToOne(
//         () => Package,
//         {
//             nullable: true,
//             eager: true,
//         },
//     )
//     package?: Package;

//     @ManyToOne(
//         () => Deal,
//         {
//             nullable: true,
//             eager: true,
//         },
//     )
//     deal?: Deal;

//     @CreateDateColumn()
//     createdAt: Date;
// }

@Entity('cart')
export class Cart {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, {
        eager: true,
        onDelete: 'CASCADE',
    })
    user: User;

    @ManyToOne(() => Branch, {
        eager: true,
        onDelete: 'CASCADE',
    })
    branch: Branch;

    @Column()
    type: string;
    

    @ManyToOne(() => Service, {
        nullable: true,
        eager: true,
    })
    service?: Service;

    @ManyToOne(() => Package, {
        nullable: true,
        eager: true,
    })
    package?: Package;

    @ManyToOne(() => Deal, {
        nullable: true,
        eager: true,
    })
    deal?: Deal;

    @ManyToOne(() => TeamMember, {
        nullable: true,
        eager: true,
    })
    teamMember?: TeamMember;

    @Column({
        nullable: true,
    })
    appointmentDate?: string;

    @Column({
        nullable: true,
    })
    startTime?: string;

    @Column({
        default: 'HOLD',
    })
    slotStatus: string;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    slotExpiresAt?: Date | null;

    @ManyToOne(() => Customer)
    @JoinColumn()
    customer: Customer;

    @CreateDateColumn()
    createdAt: Date;
}