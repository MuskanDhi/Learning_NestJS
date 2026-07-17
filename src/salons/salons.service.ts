import {
    BadRequestException,
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
        console.log("userId =", userId);
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

        if (!dto.name) {
            throw new BadRequestException(
                'Salon name is required',
            );
        }

        if (!dto.openingTime) {
            throw new BadRequestException(
                'Opening time is required',
            );
        }

        if (!dto.closingTime) {
            throw new BadRequestException(
                'Closing time is required',
            );
        }

        if (!dto.phoneNumber) {
            throw new BadRequestException(
                'Phone number is required',
            );
        }

        if (!dto.aboutUs) {
            throw new BadRequestException(
                'About us is required',
            );
        }


        if (!dto.country) {
            throw new BadRequestException(
                'Country is required',
            );
        }


        if (!/^[6-9]\d{9}$/.test(dto.phoneNumber)) {
            throw new BadRequestException(
                'Phone number must be a valid 10-digit Indian mobile number',
            );
        }

        const isValidTime = (time: string): boolean => {
            return /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/.test(time);
        };

        if (!isValidTime(dto.openingTime)) {
            throw new BadRequestException(
                'Opening time must be in format HH:MM AM/PM',
            );
        }

        if (!isValidTime(dto.closingTime)) {
            throw new BadRequestException(
                'Closing time must be in format HH:MM AM/PM',
            );
        }

        // Convert "08:00 AM" -> minutes
        const convertToMinutes = (time: string): number => {
            const [clock, period] = time.split(' ');
            let [hour, minute] = clock.split(':').map(Number);

            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;

            return hour * 60 + minute;
        };

        const opening = convertToMinutes(dto.openingTime);
        const closing = convertToMinutes(dto.closingTime);

        if (opening >= closing) {
            throw new BadRequestException(
                'Opening time must be before closing time',
            );
        }

        if (!dto.schedule || !Array.isArray(dto.schedule)) {
            throw new BadRequestException(
                'Schedule is required',
            );
        }

        if (dto.schedule.length === 0) {
            throw new BadRequestException(
                'At least one day should be open',
            );
        }

        for (const day of dto.schedule) {

            for (const slot of day.slots) {

                if (!isValidTime(slot.start)) {
                    throw new BadRequestException(
                        `${day.day}: Invalid start time format`,
                    );
                }

                if (!isValidTime(slot.end)) {
                    throw new BadRequestException(
                        `${day.day}: Invalid end time format`,
                    );
                }


                const start = convertToMinutes(slot.start);
                const end = convertToMinutes(slot.end);

                if (start < opening) {
                    throw new BadRequestException(
                        `${day.day}: Start time cannot be before salon opening time`,
                    );
                }

                if (end > closing) {
                    throw new BadRequestException(
                        `${day.day}: End time cannot be after salon closing time`,
                    );
                }

                if (start >= end) {
                    throw new BadRequestException(
                        `${day.day}: Start time must be before end time`,
                    );
                }
            }
        }

        // CREATE SALON

        console.log("Creating salon...");

        const salon = await this.salonRepository.save(
            this.salonRepository.create({
                name: dto.name,
                user,
            }),
        );

        console.log("Salon created", salon);

        console.log("Creating branch...");

        const branchEntity = this.branchRepository.create({
            ...dto,
            salon,
        });

        console.log(branchEntity);

        const branch = await this.branchRepository.save(branchEntity);

        console.log("Branch created", branch);

        console.log("Sending notification");

        this.notificationGateway.sendNotification(
            "New booking received!",
        );

        console.log("Done");
        
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