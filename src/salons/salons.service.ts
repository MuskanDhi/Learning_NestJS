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
import { NotificationGateway } from 'src/notification/notification.gateway';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SalonsService {
    constructor(
        private readonly redisService: RedisService,

        @InjectRepository(Salon)
        private salonRepository: Repository<Salon>,

        @InjectRepository(Branch)
        private branchRepository: Repository<Branch>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        private readonly notificationGateway: NotificationGateway,
    ) { }

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
        this.notificationGateway.sendNotification(
            'New booking received!',
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

    async getAllSalons() {

        const cachedSalons =
            await this.redisService.client.get('all_salons');

        if (cachedSalons) {
            console.log('Data from Redis');

            return JSON.parse(cachedSalons);
        }

        console.log('Data from Database');

        const salons = await this.salonRepository.find();

        await this.redisService.client.set(
            'all_salons',
            JSON.stringify(salons),
            {
                EX: 60, // cache for 60 seconds
            },
        );

        return salons;
    }

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

