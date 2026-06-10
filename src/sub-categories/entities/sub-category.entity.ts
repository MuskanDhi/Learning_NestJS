import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';

import { Service } from '../../services/entities/services.entity';

@Entity('sub_categories')
export class SubCategory {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(
        () => Category,
        (category) => category.subCategories,
        {
            onDelete: 'CASCADE',
        },
    )
    category: Category;

    @OneToMany(
        () => Service,
        (service) => service.subCategory,
    )
    services: Service[];
}