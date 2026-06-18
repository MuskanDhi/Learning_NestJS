import { Branch } from "src/branches/entities/branch.entity";
import { Service } from "src/services/entities/services.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => Branch)
    branch: Branch;

    @ManyToOne(() => Service)
    service: Service;

    @Column({
        nullable: true,
    })
    type: string; // package | deal

    @Column({
        nullable: true,
    })
    referenceId: string;
}