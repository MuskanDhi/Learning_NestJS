import { TeamMember } from "src/team-members/entities/team-member.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('team_member_schedules')
export class TeamMemberSchedule {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    day: string;

    @Column({ default: false })
    isOff: boolean;

    @Column({ nullable: true })
    startTime: string;

    @Column({ nullable: true })
    endTime: string;

    @ManyToOne(
        () => TeamMember,
        team => team.schedules,
        {
            onDelete: 'CASCADE',
        },
    )
    teamMember: TeamMember;
}