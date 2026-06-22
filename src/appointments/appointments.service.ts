import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Repository } from 'typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Service } from 'src/services/entities/services.entity';
import { TeamMember } from 'src/team-members/entities/team-member.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,

        @InjectRepository(Branch)
        private branchRepository: Repository<Branch>,

        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,

        @InjectRepository(Service)
        private serviceRepository: Repository<Service>,

        @InjectRepository(TeamMember)
        private teamMemberRepository: Repository<TeamMember>,
    ) { }
    private timeToMinutes(
        time: string,
    ): number {

        const [timePart, period] =
            time.split(' ');

        let [hours, minutes] =
            timePart.split(':').map(Number);

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        }

        if (period === 'AM' && hours === 12) {
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

        hours = hours % 12;

        if (hours === 0) {
            hours = 12;
        }

        return `${hours
            .toString()
            .padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')} ${period}`;
    }
    async create(
        branchId: string,
        dto: CreateAppointmentDto,
    ) {

        const branch =
            await this.branchRepository.findOne({
                where: {
                    id: branchId,
                },
                relations: {
                    salon: true,
                },
            });

        if (!branch) {
            throw new BadRequestException(
                'Branch not found',
            );
        }

        const customer =
            await this.customerRepository.findOne({
                where: {
                    id: dto.customerId,
                    branchId,
                },
            });

        if (!customer) {
            throw new BadRequestException(
                'Customer does not belong to this branch',
            );
        }

        const service = await this.serviceRepository.findOne({
            where: { id: dto.serviceId },
            relations: {
                branch: true,
            },
        });

        console.log('SERVICE:', service);
        console.log('BRANCH:', service?.branch);
        console.log('REQUEST BRANCH:', branchId);

        if (!service) {
            throw new BadRequestException('Service not found');
        }

        if (!service.branch) {
            throw new BadRequestException('Service has no branch assigned');
        }

        if (service.branch?.id !== branchId) {
            throw new BadRequestException(
                `Service belongs to branch ${service.branch?.id}`
            );
        }

        const teamMember =
            await this.teamMemberRepository.findOne({
                where: {
                    id: dto.teamMemberId,
                    branch: {
                        id: branchId,
                    },
                },
                relations: {
                    services: true,
                },
            });

        if (!teamMember) {
            throw new BadRequestException(
                'Team member does not belong to this branch',
            );
        }

        const hasService =
            teamMember.services.some(
                serviceItem =>
                    serviceItem.id === service.id,
            );

        if (!hasService) {
            throw new BadRequestException(
                'Selected team member does not provide this service',
            );
        }

        const startMinutes =
            this.timeToMinutes(
                dto.appointmentStartTime,
            );

        const durationMinutes =
            parseInt(service.duration, 10);

        const endMinutes =
            startMinutes + durationMinutes;

        const slots: string[] = [];

        for (
            let current = startMinutes;
            current < endMinutes;
            current += 15
        ) {
            slots.push(
                this.minutesToTime(current),
            );
        }

        const appointment =
            this.appointmentRepository.create({
                appointmentStartTime:
                    dto.appointmentStartTime,

                appointmentEndTime:
                    this.minutesToTime(
                        endMinutes,
                    ),

                slots,

                salon: branch.salon,

                branch,

                customer,

                service,

                teamMember,
            });

        await this.appointmentRepository.save(
            appointment,
        );

        return {
            salon: {
                id: branch.salon.id,

                branch: {
                    id: branch.id,

                    customer,

                    items: [
                        {
                            service,
                            teamMember,
                        },
                    ],

                    slots,
                },
            },
        };
    }
}
