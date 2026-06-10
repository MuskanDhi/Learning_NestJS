import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

import { Salon } from '../../salons/entities/salon.entity';
import { TeamMember } from '../../team-members/entities/team-member.entity';
import { Service } from '../../services/entities/services.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Package } from 'src/packages/entities/package.entity';
import { Deal } from 'src/deals/entities/deal.entity';


@Entity('branches')
export class Branch {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    openingTime: string;

    @Column()
    closingTime: string;

    @Column()
    phoneNumber: string;

    @Column({ type: 'text', nullable: true })
    aboutUs: string;

    // ADDRESS FIELDS

    @Column()
    flatNo: string;

    @Column()
    street: string;

    @Column()
    village: string;

    @Column()
    district: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    country: string;

    @Column()
    postalCode: string;

    // STORE SCHEDULE AS JSON

    @Column({
        type: 'json',
        nullable: true,
    })
    schedule: any[];

    @ManyToOne(
        () => Salon,
        (salon) => salon.branches,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'salon_id' })
    salon: Salon;

    @OneToMany(
        () => Category,
        (category) => category.branch,
    )
    categories: Category[];

    @OneToMany(() => TeamMember, (team) => team.branch)
    teamMembers: TeamMember[];

    @OneToMany(() => Package, (pkg) => pkg.branch)
    packages: Package[];

    @OneToMany(() => Deal, (deal) => deal.branch)
    deals: Deal[];

    @OneToMany(
        () => Service,
        (service) => service.branch,
    )
    services: Service[];
}
