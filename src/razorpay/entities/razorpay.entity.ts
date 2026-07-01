import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  orderId: string;

  @Column({ unique: true })
  paymentId: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: string;

  @Column()
  userId: string;

  @Column()
  cartId: string;

  @CreateDateColumn()
  paidAt: Date;
}