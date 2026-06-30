import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinColumn,
} from 'typeorm';

import { TeamMember } from '../../team-members/entities/team-member.entity';
import { SubCategory } from '../../sub-categories/entities/sub-category.entity';
import { Package } from '../../packages/entities/package.entity';
import { Deal } from 'src/deals/entities/deal.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Service {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    serviceName: string;

    @Column()
    price: number;

    @Column()
    duration: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(
        () => SubCategory,
        (subCategory) => subCategory.services,
        {
            onDelete: 'CASCADE',
        },
    )
    subCategory: SubCategory;

    @ManyToMany(
        () => TeamMember,
        (teamMember) => teamMember.services,
    )
    teamMembers: TeamMember[];

    @ManyToMany(
        () => Package,
        (pkg) => pkg.services,
    )
    packages: Package[];

    @ManyToMany(
        () => Deal,
        (deal) => deal.services,
    )
    deals: Deal[];

    @ManyToOne(
        () => Branch,
        (branch) => branch.services,
    )
    @JoinColumn({ name: 'branch_id' })
    branch: Branch;

    @ManyToOne(
        () => Category,
        (category) => category.services,
        {
            eager: false,
        },
    )
    @JoinColumn()
    category: Category;

}