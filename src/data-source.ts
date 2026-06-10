import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { User } from './users/entities/user.entity';

import { Salon } from './salons/entities/salon.entity';

import { Branch } from './branches/entities/branch.entity';

import { Category } from './categories/entities/category.entity';

import { SubCategory } from './sub-categories/entities/sub-category.entity';

import { Service } from './services/entities/services.entity';
import { TeamMember } from './team-members/entities/team-member.entity';

export const AppDataSource =
    new DataSource({

        type: 'postgres',

        host: 'localhost',

        port: 5432,

        username: 'apnitorsolutions',

        password: 'root',

        database: 'salon_management',

        synchronize: true,

        logging: false,

        entities: [
            User,
            Salon,
            Branch,
            Category,
            SubCategory,
            Service,
            TeamMember
        ],
    });