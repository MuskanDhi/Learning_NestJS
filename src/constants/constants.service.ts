import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/roles/entities/role.entity';
import { Specialty } from 'src/specialties/entities/specialty.entity';
import { CreateConstantDto } from './dto/create-role-specialty.dto';

@Injectable()
export class ConstantsService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepo: Repository<Role>,

        @InjectRepository(Specialty)
        private readonly specialtyRepo: Repository<Specialty>,
    ) { }

    async create(dto: CreateConstantDto) {

        if (dto.type === 'role') {

            const role = await this.roleRepo.save(
                this.roleRepo.create({
                    label: dto.name,
                }),
            );

            return {
                success: true,
                message: 'Role created successfully',
                data: role,
            };
        }

        if (dto.type == 'specialty') {

            const specialty =
                await this.specialtyRepo.save(
                    this.specialtyRepo.create({
                        name: dto.name,
                    }),
                );

            return {
                success: true,
                message: 'Specialty created successfully',
                data: specialty,
            };
        }
        return {
            message: 'Add type from one of both specialty or role',
        };
    }

    async getConstants() {

        const roles =
            await this.roleRepo.find();

        const specialties =
            await this.specialtyRepo.find();

        return {
            success: true,
            message: 'Success',
            data: {
                roles: roles.map(role => ({
                    id: role.id,
                    label: role.label,
                })),
                specialties: specialties.map(
                    specialty => ({
                        id: specialty.id,
                        name: specialty.name,
                    }),
                ),
            },
        };
    }
}