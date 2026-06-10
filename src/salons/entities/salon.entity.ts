import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Branch } from '../../branches/entities/branch.entity';

@Entity('salons')
export class Salon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;


    @ManyToOne(() => User, (user) => user.salons, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Branch, (branch) => branch.salon,
        {
            cascade: true,
        },
    )
    branches: Branch[];
}