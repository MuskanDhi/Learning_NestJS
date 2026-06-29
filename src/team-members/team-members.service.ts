import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
    In,
    Repository,
} from 'typeorm';

import { TeamMember } from './entities/team-member.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Service } from 'src/services/entities/services.entity';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { TeamMemberSchedule } from 'team-member-schedules';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Cart } from 'src/add-services-into-cart/entities/add-services-into-cart.entity';

@Injectable()
export class TeamMembersService {

    constructor(

        @InjectRepository(TeamMember)
        private teamMemberRepo: Repository<TeamMember>,

        @InjectRepository(Branch)
        private branchRepo: Repository<Branch>,

        @InjectRepository(Service)
        private serviceRepo: Repository<Service>,

        @InjectRepository(TeamMemberSchedule)
        private teamMemberScheduleRepo:
            Repository<TeamMemberSchedule>,

        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,

        @InjectRepository(Cart)
        private cartRepo: Repository<Cart>,
    ) { }

    async create(
        branchId: string,
        dto: CreateTeamMemberDto,
    ) {

        const branch =
            await this.branchRepo.findOne({
                where: {
                    id: branchId,
                },
            });

        if (!branch) {
            throw new NotFoundException(
                'Branch not found',
            );
        }

        const existingEmail =
            await this.teamMemberRepo.findOne({
                where: {
                    email: dto.email,
                },
            });

        if (existingEmail) {
            throw new BadRequestException(
                'Email already exists',
            );
        }

        const existingPhone =
            await this.teamMemberRepo.findOne({
                where: {
                    phoneNumber:
                        dto.phoneNumber,
                },
            });

        if (existingPhone) {
            throw new BadRequestException(
                'Phone number already exists',
            );
        }

        const services =
            await this.serviceRepo.find({
                where: {
                    id: In(dto.serviceIds),
                },
                relations: {
                    subCategory: {
                        category: {
                            branch: true,
                        },
                    },
                },
            });

        if (
            services.length !==
            dto.serviceIds.length
        ) {
            throw new BadRequestException(
                'One or more services not found',
            );
        }

        const invalidService =
            services.find(
                (service) =>
                    service.subCategory
                        .category
                        .branch
                        .id !== branchId,
            );

        if (invalidService) {
            throw new BadRequestException(
                'Selected service does not belong to this branch',
            );
        }

        for (const schedule of dto.workingSchedule) {

            // const branchDay =
            //     branch.schedule.find(
            //         day =>
            //             day.day === schedule.day,
            //     );
            const branchDay = branch.schedule?.find(
                (branchSchedule) =>
                    branchSchedule.day.toLowerCase() ===
                    schedule.day.toLowerCase(),
            );

            if (!branchDay) {
                throw new BadRequestException(
                    `${schedule.day} is closed in branch`,
                );
            }

            if (schedule.isOff) {
                continue;
            }

            for (const slot of schedule.slots || []) {

                if (
                    slot.startTime < branchDay.openTime ||
                    slot.endTime > branchDay.closeTime
                ) {
                    throw new BadRequestException(
                        `${schedule.day} slot must be within branch hours`,
                    );
                }
            }
        }

        const teamMember = await this.teamMemberRepo.save(
            this.teamMemberRepo.create({
                ...dto,
                branch,
                services,
            }),
        );

        const schedules: Partial<TeamMemberSchedule>[] = [];

        for (const day of dto.workingSchedule) {

            if (day.isOff) {

                schedules.push({
                    day: day.day,
                    isOff: true,
                    teamMember,
                });

            } else {

                for (const slot of day.slots || []) {

                    schedules.push({
                        day: day.day,
                        isOff: false,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        teamMember,
                    });
                }
            }
        }

        await this.teamMemberScheduleRepo.save(
            schedules,
        );

        return {
            message: 'Team member created successfully',
            branch: {
                ...branch,
                teamMember,
            },
        };
    }


    async findByBranch(branchId: string) {

        const branch =
            await this.branchRepo.findOne({
                where: {
                    id: branchId,
                },
            });

        if (!branch) {
            throw new NotFoundException(
                'Branch not found',
            );
        }

        const teamMembers =
            await this.teamMemberRepo.find({
                where: {
                    branch: {
                        id: branchId,
                    },
                },
                relations: {
                    services: true,
                },
            });

        return {
            branch: {
                ...branch,
                teamMembers: teamMembers.map(
                    ({ branch, ...member }) => member,
                ),
            },
        };
    }

    async update(
        teamId: string,
        body,
        userId: string,
    ) {
        const teams =
            await this.teamMemberRepo.findOne({
                where: {
                    id: teamId,
                },
                relations: {
                    branch: {
                        salon: {
                            user: true,
                        },
                    },
                    services: true,
                },
            });

        if (!teams) {
            throw new NotFoundException(
                'Team Member not found',
            );
        }

        if (teams.branch.salon.user.id !== userId) {
            throw new BadRequestException(
                "This Team Member not belong to you",
            );
        }

        if (body.serviceIds) {
            const services = await this.serviceRepo.find({
                where: {
                    id: In(body.serviceIds),
                },
                relations: {
                    subCategory: {
                        category: {
                            branch: true,
                        },
                    },
                },
            });

            if (
                services.length !== body.serviceIds.length
            ) {
                throw new BadRequestException(
                    'One or more services not found',
                );
            }

            const invalidService = services.find(
                (service) =>
                    service.subCategory.category.branch.id !== teams.branch.id,
            );

            if (invalidService) {
                throw new BadRequestException(
                    'Selected service does not belong to this branch',
                );
            }

            teams.services = services;

            delete body.serviceIds;
        }

        Object.assign(teams, body);

        const updateTeamMembers =
            await this.teamMemberRepo.save(
                teams,
            );

        return {
            message:
                'Team Member updated successfully',
            TeamMember: updateTeamMembers,
        };
    }

    async remove(
        teamId: string,
        userId: string,
    ) {
        const teams =
            await this.teamMemberRepo.findOne({
                where: {
                    id: teamId,
                },
                relations: {
                    branch: {
                        salon: {
                            user: true,
                        },
                    },
                },
            });

        if (!teams) {
            throw new NotFoundException(
                'Team Member not found',
            );
        }

        if (
            teams.branch.salon.user.id !== userId
        ) {
            throw new BadRequestException(
                'This Team Member not belong to you',
            );
        }

        await this.teamMemberRepo.remove(
            teams,
        );

        return {
            message:
                'Team Member deleted successfully'
        }
    }

    // async getAvailableSlots(
    //     teamMemberId: string,
    //     date: string,
    // ) {
    //     const teamMember =
    //         await this.teamMemberRepo.findOne({
    //             where: {
    //                 id: teamMemberId,
    //             },
    //         });

    //     if (!teamMember) {
    //         throw new NotFoundException(
    //             'Team member not found',
    //         );
    //     }

    //     const selectedDate = new Date(date);

    //     const dayName =
    //         selectedDate.toLocaleDateString(
    //             'en-US',
    //             {
    //                 weekday: 'long',
    //             },
    //         );

    //     const schedules =
    //         await this.teamMemberScheduleRepo.find({
    //             where: {
    //                 teamMember: {
    //                     id: teamMemberId,
    //                 },
    //                 day: dayName,
    //             },
    //         });

    //     if (!schedules.length) {
    //         throw new BadRequestException(
    //             `${dayName} schedule not found`,
    //         );
    //     }

    //     if (schedules.every(slot => slot.isOff)) {
    //         throw new BadRequestException(
    //             `${dayName} is off day`,
    //         );
    //     }

    //     // Slots currently held in cart

    //     const reservedCartSlots =
    //         await this.cartRepo.find({
    //             where: [
    //                 {
    //                     appointmentDate: date,
    //                     slotStatus: 'HOLD',
    //                     teamMember: {
    //                         id: teamMemberId,
    //                     },
    //                 },
    //                 {
    //                     appointmentDate: date,
    //                     slotStatus: 'RESERVED',
    //                     teamMember: {
    //                         id: teamMemberId,
    //                     },
    //                 },
    //             ],
    //         });

    //     // Already booked appointments
    //     const bookedAppointments =
    //         await this.appointmentRepository.find({
    //             where: {
    //                 appointmentDate: date,
    //                 teamMember: {
    //                     id: teamMemberId,
    //                 },
    //             },
    //             relations: {
    //                 teamMember: true,
    //             },
    //         });

    //     const unavailableSlots = [
    //         ...reservedCartSlots.map(
    //             cart => cart.startTime,
    //         ),
    //         ...bookedAppointments.map(
    //             appointment =>
    //                 appointment.appointmentStartTime,
    //         ),
    //     ];

    //     const availableSlots: {
    //         startTime: string;
    //         endTime: string;
    //     }[] = [];

    //     const now = new Date();

    //     const activeHolds = reservedCartSlots.filter(
    //         slot =>
    //             !slot.slotExpiresAt ||
    //             slot.slotExpiresAt > now,
    //     );

    //     for (const schedule of schedules) {
    //         if (schedule.isOff) {
    //             continue;
    //         }

    //         const isToday =
    //             selectedDate.toDateString() ===
    //             now.toDateString();

    //         if (isToday) {
    //             const [time, modifier] =
    //                 schedule.startTime.split(' ');

    //             let [hours, minutes] =
    //                 time.split(':').map(Number);

    //             if (
    //                 modifier === 'PM' &&
    //                 hours !== 12
    //             ) {
    //                 hours += 12;
    //             }

    //             if (
    //                 modifier === 'AM' &&
    //                 hours === 12
    //             ) {
    //                 hours = 0;
    //             }

    //             const slotTime = new Date();

    //             slotTime.setHours(
    //                 hours,
    //                 minutes,
    //                 0,
    //                 0,
    //             );

    //             if (slotTime <= now) {
    //                 continue;
    //             }
    //         }

    //         // Hide reserved or booked slots
    //         if (
    //             unavailableSlots.includes(
    //                 schedule.startTime,
    //             )
    //         ) {
    //             continue;
    //         }

    //         availableSlots.push({
    //             startTime: schedule.startTime,
    //             endTime: schedule.endTime,
    //         });
    //     }

    //     return {
    //         teamMemberId,
    //         date,
    //         day: dayName,
    //         availableSlots,
    //     };
    // }

    async getAvailableSlots(
        teamMemberId: string,
        date: string,
    ) {
        const teamMember =
            await this.teamMemberRepo.findOne({
                where: {
                    id: teamMemberId,
                },
            });

        if (!teamMember) {
            throw new NotFoundException(
                'Team member not found',
            );
        }

        const selectedDate = new Date(date);

        const dayName =
            selectedDate.toLocaleDateString(
                'en-US',
                {
                    weekday: 'long',
                },
            );

        const schedules =
            await this.teamMemberScheduleRepo.find({
                where: {
                    teamMember: {
                        id: teamMemberId,
                    },
                    day: dayName,
                },
            });

        if (!schedules.length) {
            throw new BadRequestException(
                `${dayName} schedule not found`,
            );
        }

        if (schedules.every(slot => slot.isOff)) {
            throw new BadRequestException(
                `${dayName} is off day`,
            );
        }

        // Slots currently on HOLD or RESERVED
        const cartSlots =
            await this.cartRepo.find({
                where: [
                    {
                        appointmentDate: date,
                        slotStatus: 'HOLD',
                        teamMember: {
                            id: teamMemberId,
                        },
                    },
                    {
                        appointmentDate: date,
                        slotStatus: 'RESERVED',
                        teamMember: {
                            id: teamMemberId,
                        },
                    },
                ],
                relations: {
                    teamMember: true,
                },
            });

        // Remove expired HOLD slots
        const now = new Date();

        const activeSlots = cartSlots.filter(
            slot =>
                slot.slotStatus === 'RESERVED' ||
                !slot.slotExpiresAt ||
                slot.slotExpiresAt > now,
        );

        // Existing appointments
        const bookedAppointments =
            await this.appointmentRepository.find({
                where: {
                    appointmentDate: date,
                    teamMember: {
                        id: teamMemberId,
                    },
                },
                relations: {
                    teamMember: true,
                },
            });

        const unavailableSlots = [
            ...activeSlots.map(
                slot => slot.startTime,
            ),
            ...bookedAppointments.map(
                appointment =>
                    appointment.appointmentStartTime,
            ),
        ];

        const availableSlots: {
            startTime: string;
            endTime: string;
        }[] = [];

        for (const schedule of schedules) {
            if (schedule.isOff) {
                continue;
            }

            const isToday =
                selectedDate.toDateString() ===
                now.toDateString();

            if (isToday) {
                const [time, modifier] =
                    schedule.startTime.split(' ');

                let [hours, minutes] =
                    time.split(':').map(Number);

                if (
                    modifier === 'PM' &&
                    hours !== 12
                ) {
                    hours += 12;
                }

                if (
                    modifier === 'AM' &&
                    hours === 12
                ) {
                    hours = 0;
                }

                const slotTime = new Date();

                slotTime.setHours(
                    hours,
                    minutes,
                    0,
                    0,
                );

                if (slotTime <= now) {
                    continue;
                }
            }

            // Skip held/reserved/booked slots
            if (
                unavailableSlots.includes(
                    schedule.startTime,
                )
            ) {
                continue;
            }

            availableSlots.push({
                startTime: schedule.startTime,
                endTime: schedule.endTime,
            });
        }

        return {
            teamMemberId,
            date,
            day: dayName,
            availableSlots,
        };
    }
}