import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Salon } from './entities/salon.entity';

import { CreateSalonDto } from './dto/create-salon.dto';
import { Branch } from 'src/branches/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SalonsService {
    constructor(
        @InjectRepository(Salon)
        private salonRepository: Repository<Salon>,

        @InjectRepository(Branch)
        private branchRepository: Repository<Branch>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // async create(body, userId: string) {
    //     const user =
    //         await this.userRepository.findOne({
    //             where: { id: userId },
    //         });

    //     if (!user) {
    //         throw new NotFoundException(
    //             'User not found',
    //         );
    //     }

    //     const existingSalon =
    //         await this.salonRepository.findOne({
    //             where: {
    //                 ownerPhoneNumber:
    //                     body.ownerPhoneNumber,
    //             },
    //         });

    //     if (existingSalon) {
    //         throw new BadRequestException(
    //             'Owner phone number already exists',
    //         );
    //     }

    //     const salon =
    //         this.salonRepository.create({
    //             ...body,
    //             user,
    //         });

    //     return await this.salonRepository.save(
    //         salon,
    //     );
    // }


    async create(
        dto: CreateSalonDto,
        userId: string,
    ) {

        // CHECK USER

        const user =
            await this.userRepository.findOne({
                where: {
                    id: userId,
                },
            });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        // CREATE SALON

        const salon =
            await this.salonRepository.save(
                this.salonRepository.create({
                    name: dto.name,
                    user,
                }),
            );

        // CREATE BRANCH

        const branch =
            await this.branchRepository.save(
                this.branchRepository.create({
                    ...dto,
                    salon,
                }),
            );
        return {
            message:
                'Salon created successfully',

            salon: {
                ...salon,

                branches: [
                    branch,
                ],
            },
        }
    }

    // async findMySalons(userId: string) {
    //     return await this.salonRepository.find({
    //         where: {
    //             user: {
    //                 id: userId,
    //             },
    //         },
    //         relations: {
    //             user: true,
    //             branches: true,
    //         },
    //     });
    // }
    async findMySalons(userId: string) {

        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: {
                salons: {
                    branches: {
                        categories: {
                            subCategories: {
                                services: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            throw new NotFoundException(
                'User not found',
            );
        }

        return {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
            salons: user.salons,
        };
    }

    async update(
        salonId: string,
        body,
        userId: string,
    ) {
        const salon =
            await this.salonRepository.findOne({
                where: {
                    id: salonId,
                    user: {
                        id: userId,
                    },
                },
                relations: {
                    user: true,
                },
            });

        if (!salon) {
            throw new NotFoundException(
                'Salon not found',
            );
        }

        Object.assign(salon, body);

        const Salon = await this.salonRepository.save(
            salon,
        );

        return {
            message:
                'Update salon successfully',
            Salon
        }
    }

    async remove(
        salonId: string,
        userId: string,
    ) {
        const salon =
            await this.salonRepository.findOne({
                where: {
                    id: salonId,
                    user: {
                        id: userId,
                    },
                },
                relations: {
                    user: true,
                },
            });

        if (!salon) {
            throw new NotFoundException(
                'Salon not found',
            );
        }

        await this.salonRepository.remove(
            salon,
        );

        return {
            message:
                'Salon deleted successfully',
        };
    }

}

