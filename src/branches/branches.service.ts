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
    // private timeToMinutes(
    //     time: string,
    // ): number {

    //     const [hours, minutes] =
    //         time.split(':').map(Number);

    //     return (
    //         hours * 60 + minutes
    //     );
    // }
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

            if(end <= current){
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