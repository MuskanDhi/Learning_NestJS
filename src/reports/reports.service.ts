import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Between, Repository } from 'typeorm';

@Injectable()
export class ReportsService {
    constructor(

        @InjectRepository(Branch)
        private branchRepo: Repository<Branch>,

        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
    ) { }

    async getDashBoardReport(branchId: string, dateRange: string) {

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

        const now = new Date();

        let startDate: Date;

        switch (dateRange) {
            case 'today':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                break;

            case 'this_week':
                startDate = new Date();
                startDate.setDate(now.getDate() - now.getDay());
                startDate.setHours(0, 0, 0, 0);
                break;

            case 'this_month':
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1,
                );
                break;

            case 'this_year':
                startDate = new Date(
                    now.getFullYear(),
                    0,
                    1,
                );
                break;

            default:
                throw new NotFoundException(
                    'Invalid date range',
                );
        }

        const appointments =
            await this.appointmentRepository.find({
                where: {
                    branch: {
                        id: branchId,
                    },
                    createdAt: Between(
                        startDate,
                        now,
                    ),
                },
                relations: {
                    branch: true,
                    services: {
                        category: true
                    }
                },
            });

        console.dir(appointments, {
            depth: null,
        });

        const totalRevenue =
            appointments.reduce(
                (total, appointment) => {
                    const amount =
                        appointment.services.reduce(
                            (sum, service) =>
                                sum + Number(service.price),
                            0,
                        );

                    return total + amount;
                },
                0,
            );

        const categoryMap = new Map();

        appointments.forEach((appointment) => {
            appointment.services.forEach((service) => {
                appointments.forEach((appointment) => {
                    appointment.services.forEach((service) => {
                        console.log(
                            'Service:',
                            service.serviceName,
                            'Category:',
                            service.category,)
                    });
                });
                if (!service.category) {
                    return;
                }
                const categoryId =
                    service.category.id;

                if (!categoryMap.has(categoryId)) {
                    categoryMap.set(categoryId, {
                        categoryId,
                        categoryName:
                            service.category.name,
                        categoryRevenue: 0,
                        services: new Map(),
                    });
                }

                const category =
                    categoryMap.get(categoryId);

                category.categoryRevenue +=
                    Number(service.price);

                if (
                    !category.services.has(
                        service.id,
                    )
                ) {
                    category.services.set(
                        service.id,
                        {
                            serviceId:
                                service.id,
                            serviceName:
                                service.serviceName,
                            serviceRevenue: 0,
                        },
                    );
                }

                category.services.get(
                    service.id,
                ).serviceRevenue +=
                    Number(service.price);
            });
        });
        const revenueByServiceCategory =
            Array.from(
                categoryMap.values(),
            ).map((category) => ({
                categoryId:
                    category.categoryId,
                categoryName:
                    category.categoryName,
                categoryRevenue:
                    category.categoryRevenue,
                services: Array.from(
                    category.services.values(),
                ),
            }));

        return {
            dateRange,
            totalSales:
                appointments.length,
            totalRevenue,
            revenueByServiceCategory
        };
    }
}