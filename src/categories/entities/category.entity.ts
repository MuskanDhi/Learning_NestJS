import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
} from 'typeorm';

import { SubCategory } from '../../sub-categories/entities/sub-category.entity';
import { Branch } from '../../branches/entities/branch.entity';

@Entity('categories')
export class Category {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        unique: true,
    })
    name: string;

    @OneToMany(
        () => SubCategory,
        (subCategory) => subCategory.category,
    )
    subCategories: SubCategory[];

    @ManyToOne(
        () => Branch,
        (branch) => branch.categories,
        {
            onDelete: 'CASCADE',
        },
    )
    branch: Branch;
}