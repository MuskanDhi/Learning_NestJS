import { Branch } from 'src/branches/entities/branch.entity';
import { Service } from 'src/services/entities/services.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('deals')
export class Deal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    dealName: string;

    @Column()
    originalPrice: string;

    @Column()
    offeredPrice: string;

    // { type: 'date' }
    @Column()
    startDate: string;

    @Column()
    endDate: string;

    @ManyToOne(
        () => Branch,
        (branch) => branch.deals,
        {
            onDelete: 'CASCADE',
        },
    )
    branch: Branch;

    @ManyToMany(
        () => Service,
        (service) => service.deals,
        {
            eager: true,
        },
    )
    @JoinTable()
    services: Service[];
}