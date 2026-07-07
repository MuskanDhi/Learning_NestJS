import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InventoryItem } from "./inventory-item.entity";
import { Appointment } from "src/appointments/entities/appointment.entity";

@Entity('inventory_usage')
export class InventoryUsage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Appointment)
    appointment: Appointment;

    @ManyToOne(() => InventoryItem)
    item: InventoryItem;

    @Column()
    quantity: number;

    @CreateDateColumn()
    createdAt: Date;
}