import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';

import { Branch } from 'src/branches/entities/branch.entity';
import { Salon } from 'src/salons/entities/salon.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { TeamMember } from 'src/team-members/entities/team-member.entity';
import { Service } from 'src/services/entities/services.entity';

@Entity('appointments')
export class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    appointmentStartTime: string;

    @Column()
    appointmentEndTime: string;

    @Column('simple-array')
    slots: string[];

    // BOOKED → IN_PROGRESS → COMPLETED → CANCELLED
    @Column({
        default: 'BOOKED',
    })
    status: string;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    jobStartedAt: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    jobCompletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Salon)
    @JoinColumn()
    salon: Salon;

    @ManyToOne(() => Branch)
    @JoinColumn()
    branch: Branch;

    @ManyToOne(() => Customer)
    @JoinColumn()
    customer: Customer;

    @ManyToOne(() => Service)
    @JoinColumn()
    service: Service;

    @ManyToOne(() => TeamMember)
    @JoinColumn()
    teamMember: TeamMember;
}