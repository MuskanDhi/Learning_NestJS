import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('specialty')
export class Specialty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}