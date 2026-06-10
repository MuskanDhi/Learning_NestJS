import { Branch } from 'src/branches/entities/branch.entity';
import { Service } from 'src/services/entities/services.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('packages')
export class Package {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    packageName: string;

    @Column()
    originalPrice: string;

    @Column()
    offeredPrice: string;

    @Column()
    duration: string;

    @Column({
        generated: 'increment',
        unique: true,
    })
    number: number;

    @Column({
        type: 'enum',
        enum: ['day', 'month', 'year'],
    })
    unit: string;

    @ManyToOne(
        () => Branch,
        (branch) => branch.packages,
        {
            onDelete: 'CASCADE',
        },
    )
    branch: Branch;

    @ManyToMany(
        () => Service,
        (service) => service.packages,
        {
            eager: true,
        },
    )
    @JoinTable()
    services: Service[];

}
