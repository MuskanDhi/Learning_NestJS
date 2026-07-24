import { TeamMember } from "src/team-members/entities/team-member.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    label: string;

    @OneToMany(
        () => TeamMember,
        (teamMember) => teamMember.role,
    )
    teamMembers: TeamMember[];
}