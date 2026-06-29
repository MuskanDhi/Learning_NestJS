import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    ManyToMany,
    JoinTable,
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

    @Column({
        nullable: true,
    })
    appointmentDate: string;

    @Column()
    appointmentStartTime: string;

    @Column({
        nullable: true,
    })
    appointmentEndTime: string;

    @Column('simple-array',{
        nullable: true,
    })
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

    @ManyToOne(() => Salon,{
        nullable: true,
    })
    @JoinColumn()
    salon: Salon;

    @ManyToOne(() => Branch)
    @JoinColumn()
    branch: Branch;

    @ManyToOne(() => Customer,{
        nullable: true,
    })
    @JoinColumn()
    customer: Customer;

    @ManyToMany(() => Service, {
        eager: true,
    })
    @JoinTable()
    services: Service[];

    @ManyToOne(() => TeamMember)
    @JoinColumn()
    teamMember: TeamMember;
}