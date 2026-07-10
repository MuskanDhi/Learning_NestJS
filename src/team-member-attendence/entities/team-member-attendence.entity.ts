import { TeamMember } from "src/team-members/entities/team-member.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('team_member_attendance')
export class TeamMemberAttendance {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TeamMember)
  teamMember: TeamMember;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'timestamp', nullable: true })
  checkInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutTime: Date;

  @Column({
    type: 'enum',
    enum: ['PRESENT', 'ABSENT'],
    default: 'PRESENT',
  })
  status: string;
}