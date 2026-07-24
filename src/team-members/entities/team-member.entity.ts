import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { Service } from '../../services/entities/services.entity';
import { TeamMemberSchedule } from 'team-member-schedules';
import { Role } from 'src/roles/entities/role.entity';
import { Specialty } from 'src/specialties/entities/specialty.entity';
@Entity('team_members')
export class TeamMember {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phoneNumber: string;

    @Column()
    address: string;

    @Column()
    joiningDate: string;

    @Column()
    aboutMember: string;

    @Column()
    gender: string;

    @Column({ nullable: true })
    profileImage: string;

    @Column({ nullable: true })
    experience: string;

    @ManyToMany(() => Specialty, {
        eager: true
    })
    @JoinTable()
    specialties: Specialty[];


    @ManyToOne(
        () => Branch,
        (branch) => branch.teamMembers,
        {
            onDelete: 'CASCADE',
        },
    )
    branch: Branch;

    @ManyToMany(
        () => Service,
        (service) => service.teamMembers,
        {
            eager: true,
        },
    )
    @JoinTable()
    services: Service[];

    @OneToMany(
        () => TeamMemberSchedule,
        schedule => schedule.teamMember,
        {
            cascade: true,
            eager: true,
        },
    )
    schedules: TeamMemberSchedule[];

    @ManyToOne(
        () => Role,
        (role) => role.teamMembers,
        {
            eager: true,
        },
    )
    role: Role;

    @Column({
        length: 6,
        nullable: true,
    })
    pin: string;

    @Column({
        default: false,
    })
    isCheckedIn: boolean;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    checkInTime: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    checkOutTime: Date | null;

}