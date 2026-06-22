import { PurchasedDeal } from "src/purchased-deals/entities/purchased-deal.entity";
import { Service } from "src/services/entities/services.entity";
import { TeamMember } from "src/team-members/entities/team-member.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('purchased_deal_services')
export class PurchasedDealService {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => PurchasedDeal,
        purchased => purchased.services,
        {
            onDelete: 'CASCADE',
        },
    )
    purchasedDeal: PurchasedDeal;

    @ManyToOne(() => Service)
    service: Service;

    @ManyToOne(
        () => TeamMember,
        {
            nullable: true,
        },
    )
    teamMember: TeamMember;

    @Column({
        nullable: true,
    })
    appointmentDate: string;

    @Column({
        nullable: true,
    })
    startTime: string;

    @Column({
        default: false,
    })
    isUsed: boolean;

    @Column({
        nullable: true,
        type: 'timestamp',
    })
    usedAt: Date;
}
