import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Branch } from './entities/branch.entity';
import { Salon } from '../salons/entities/salon.entity';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
    constructor(
        @InjectRepository(Branch)
        private branchRepository: Repository<Branch>,

        @InjectRepository(Salon)
        private salonRepository: Repository<Salon>,
    ) { }
    private timeToMinutes(
        time: string,
    ): number {

        const [timePart, period] =
            time.split(' ');

        let [hours, minutes] =
            timePart.split(':').map(Number);

        if (
            period === 'PM' &&
            hours !== 12
        ) {
            hours += 12;
        }

        if (
            period === 'AM' &&
            hours === 12
        ) {
            hours = 0;
        }

        return hours * 60 + minutes;
    }

    private minutesToTime(
        totalMinutes: number,
    ): string {

        totalMinutes = totalMinutes % 1440;

        let hours =
            Math.floor(totalMinutes / 60);

        const minutes =
            totalMinutes % 60;

        const period =
            hours >= 12 ? 'PM' : 'AM';

        hours =
            hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        return `${hours
            .toString()
            .padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')} ${period}`;
    }

    async findBySalon(
        salonId: string,
    ) {

        const salon =
            await this.salonRepository.findOne({
                where: {
                    id: salonId,
                },
                relations: {
                    branches: {
                        categories: {
                            subCategories: {
                                services: true,
                            },
                        },
                    },
                },
            });

        if (!salon) {
            throw new NotFoundException(
                'Salon not found',
            );
        }

        return {
            salons: salon,
        };
    }

    async create(
        salonId: string,
        dto: CreateBranchDto,
    ) {

        // CHECK SALON

        const salon =
            await this.salonRepository.findOne({
                where: {
                    id: salonId,
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

        if (!dto.city) {
            throw new BadRequestException(
                'City is required',
            );
        }

        if (!dto.state) {
            throw new BadRequestException(
                'State is required',
            );
        }

        if (!dto.country) {
            throw new BadRequestException(
                'Country is required',
            );
        }

        if (!dto.postalCode) {
            throw new BadRequestException(
                'Postal code is required',
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
                'Branch Added successfully',

            salon: {
                ...salon,

                branches: [
                    branch,
                ],
            },
        };
    }


    //UPDATE BRANCH
    async update(
        branchId: string,
        body,
        userId: string,
    ) {

        const branch =
            await this.branchRepository.findOne({
                where: {
                    id: branchId,
                },
                relations: {
                    salon: {
                        user: true,
                    },
                },
            });

        if (!branch) {
            throw new NotFoundException(
                'Branch not found',
            );
        }


        if (branch.salon.user.id !== userId) {
            throw new BadRequestException(
                'This branch does not belong to you',
            );
        }

        // CHECK PHONE NUMBER

        if (
            body.phoneNumber &&
            body.phoneNumber !== branch.phoneNumber
        ) {

            const existingBranch =
                await this.branchRepository.findOne({
                    where: {
                        phoneNumber:
                            body.phoneNumber,
                    },
                });

            if (existingBranch) {
                throw new BadRequestException(
                    'Branch phone number already exists',
                );
            }
        }
        Object.assign(branch, body);

        return {
            message: 'Branch updated successfully',
            branch: await this.branchRepository.save(branch),
        };

    }

    //DELETE BRANCH
    async remove(
        branchId: string,
        userId: string,
    ) {

        const branch =
            await this.branchRepository.findOne({
                where: {
                    id: branchId,
                },
                relations: {
                    salon: {
                        user: true,
                    },
                },
            });

        if (!branch) {
            throw new NotFoundException(
                'Branch not found',
            );
        }

        // SECURITY CHECK

        if (branch.salon.user.id !== userId) {
            throw new BadRequestException(
                'This branch does not belong to you',
            );
        }

        const salonId = branch.salon.id;

        // DELETE BRANCH

        await this.branchRepository.remove(branch);

        // CHECK REMAINING BRANCHES

        const remainingBranches =
            await this.branchRepository.count({
                where: {
                    salon: {
                        id: salonId,
                    },
                },
            });

        // IF NO BRANCH LEFT DELETE SALON

        if (remainingBranches === 0) {

            await this.salonRepository.delete(
                salonId,
            );

            return {
                message:
                    'Branch deleted successfully and salon also deleted because no branches left',
            };
        }

        return {
            message:
                'Branch deleted successfully',
        };
    }

    async getSlots(
        branchId: string,
        day: string,
    ) {

        const branch =
            await this.branchRepository.findOne({
                where: {
                    id: branchId,
                },
            });

        if (!branch) {
            throw new NotFoundException(
                'Branch not found',
            );
        }

        const daySchedule =
            branch.schedule.find(
                schedule =>
                    schedule.day.toLowerCase() ===
                    day.toLowerCase(),
            );

        if (!daySchedule) {
            return {
                message:
                    `Salon is closed ${day}`,
                slots: [],
            };
        }

        // const slots = [];
        const slots: {
            startTime: string;
            endTime: string;
        }[] = [];

        for (const period of daySchedule.slots) {

            let current =
                this.timeToMinutes(
                    period.start,
                );

            let end =
                this.timeToMinutes(
                    period.end,
                );

            if (end <= current) {
                end += 1440;
            }

            while (current < end) {

                slots.push({
                    startTime:
                        this.minutesToTime(
                            current,
                        ),
                    endTime:
                        this.minutesToTime(
                            current + 15,
                        ),
                });

                current += 15;
            }
        }

        return {
            day,
            totalSlots:
                slots.length,
            slots,
        };
    }

}