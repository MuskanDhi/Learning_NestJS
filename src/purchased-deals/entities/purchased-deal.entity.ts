import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    Column,
} from 'typeorm';
import { Deal } from 'src/deals/entities/deal.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Entity('purchased_deals')
export class PurchasedDeal {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Deal, {
        eager: true,
    })
    deal: Deal;

    @ManyToOne(() => Branch, {
        eager: true,
    })
    branch: Branch;

    @CreateDateColumn()
    purchasedAt: Date;

    @Column()
    expiryDate: Date;

    @Column({
        default: 'active',
    })
    status: string;
}

