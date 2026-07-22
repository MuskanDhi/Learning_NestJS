import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';


import { CreateServiceDto } from './dto/create-service.dto';
import { SubCategory } from 'src/sub-categories/entities/sub-category.entity';
import { CommissionType } from './entities/commission-type.enum';
import { Service } from './entities/services.entity';

@Injectable()
export class ServicesService {
    constructor(

        @InjectRepository(Service)
        private serviceRepo: Repository<Service>,

        @InjectRepository(SubCategory)
        private subCategoryRepo: Repository<SubCategory>,
    ) { }

    async create(
        subCategoryId: string,
        dto: CreateServiceDto,
    ) {
        const subCategory =
            await this.subCategoryRepo.findOne({
                where: {
                    id: subCategoryId,
                },
                relations: {
                    category: {
                        branch: true,
                    },
                },
            });

        if (!subCategory) {
            throw new NotFoundException(
                'SubCategory not found',
            );
        }

        const existingService =
            await this.serviceRepo.findOne({
                where: {
                    serviceName: dto.serviceName,
                    subCategory: {
                        id: subCategoryId,
                    },
                },
                relations: {
                    subCategory: true,
                },
            });

        if (existingService) {
            throw new BadRequestException(
                'Service already exists',
            );
        }
        // console.log('Branch ID:', subCategory.category.branch?.id);

        if (
            dto.commissionType == null &&
            (
                dto.commissionAmount != null ||
                dto.commissionPercentage != null ||
                dto.maxCommissionAmount != null
            )
        ) {
            throw new BadRequestException(
                "Please select commission type."
            );
        }

        if (
            dto.commissionType != null &&
            dto.commissionType !== CommissionType.FIXED &&
            dto.commissionType !== CommissionType.PERCENTAGE
        ) {
            throw new BadRequestException(
                "Invalid commission type."
            );
        }

        if (dto.price <= 0) {
            throw new BadRequestException(
                "Price must be greater than 0."
            );
        }

        if (!dto.duration?.trim()) {
            throw new BadRequestException(
                "Duration is required."
            );
        }

        if (dto.commissionType === CommissionType.FIXED) {

            if (
                dto.commissionAmount == null
            ) {
                throw new BadRequestException(
                    "Commission amount is required"
                );
            }

            if (
                dto.commissionPercentage != null ||
                dto.maxCommissionAmount != null
            ) {
                throw new BadRequestException(
                    "Percentage commission fields are not allowed for FIXED commission."
                );
            }

            if (dto.commissionAmount <= 0) {
                throw new BadRequestException(
                    "Commission amount must be greater than 0."
                );
            }

            dto.commissionPercentage = undefined;
            dto.maxCommissionAmount = undefined;

        } else if (dto.commissionType === CommissionType.PERCENTAGE) {

            if (
                dto.commissionPercentage == null
            ) {
                throw new BadRequestException(
                    "Commission percentage is required"
                );
            }

            if (
                dto.commissionPercentage <= 0 ||
                dto.commissionPercentage > 100
            ) {
                throw new BadRequestException(
                    "Commission percentage must be between 1 and 100."
                );
            }

            if (
                dto.maxCommissionAmount == null
            ) {
                throw new BadRequestException(
                    "Maximum commission amount is required"
                );
            }

            if (dto.commissionAmount != null) {
                throw new BadRequestException(
                    "Fixed commission amount is not allowed for PERCENTAGE commission."
                );
            }

            if (dto.maxCommissionAmount <= 0) {
                throw new BadRequestException(
                    "Maximum commission amount must be greater than 0."
                );
            }

            dto.commissionAmount = undefined;
        }

        type Test = Parameters<typeof this.serviceRepo.create>[0];

        // const service =
        //     this.serviceRepo.create({
        //         serviceName: dto.serviceName,
        //         price: dto.price,
        //         duration: dto.duration,
        //         description: dto.description,

        //         commissionType: dto.commissionType,
        //         commissionAmount: dto.commissionAmount,
        //         commissionPercentage: dto.commissionPercentage,
        //         maxCommissionAmount: dto.maxCommissionAmount,

        //         subCategory,
        //         category: subCategory.category,
        //         branch: subCategory.category.branch,
        //     });

        const payload: Partial<Service> = {
            serviceName: dto.serviceName,
            price: dto.price,
            duration: dto.duration,
            description: dto.description,

            commissionType: dto.commissionType,
            commissionAmount: dto.commissionAmount,
            commissionPercentage: dto.commissionPercentage,
            maxCommissionAmount: dto.maxCommissionAmount,

            subCategory,
            category: subCategory.category,
            branch: subCategory.category.branch,
        };

        const service = this.serviceRepo.create(payload);

        await this.serviceRepo.save(service);

        // console.log(service);

        return {
            message: 'Service created successfully',

            category: {
                id: subCategory.category.id,
                name: subCategory.category.name,

                subCategory: {
                    id: subCategory.id,
                    name: subCategory.name,

                    services: [
                        {
                            id: service.id,
                            serviceName: service.serviceName,
                            price: service.price,
                            duration: service.duration,
                            description: service.description,

                            ...(service.commissionType && {
                                commissionType: service.commissionType,
                                commissionAmount: service.commissionAmount,
                                commissionPercentage:
                                    service.commissionPercentage,
                                maxCommissionAmount:
                                    service.maxCommissionAmount,
                            }),
                        },
                    ]
                },
            },
        };
    }

    async findAll(branchId: string) {
        const services = await this.serviceRepo.find({
            where: {
                branch: {
                    id: branchId,
                },
            },
            relations: {
                category: true,
                subCategory: true,
            },
            order: {
                id: "DESC",
            },
        });

        return {
            message: 'Services fetched successfully',
            services: services.map((service) => ({
                id: service.id,
                serviceName: service.serviceName,
                price: service.price,
                duration: service.duration,
                description: service.description,

                commissionType: service.commissionType,
                commissionAmount: service.commissionAmount,
                commissionPercentage:
                    service.commissionPercentage,
                maxCommissionAmount:
                    service.maxCommissionAmount,

                category: {
                    id: service.category.id,
                    name: service.category.name,
                },

                subCategory: {
                    id: service.subCategory.id,
                    name: service.subCategory.name,
                },
            })),
        };
    }

    async update(
        serviceId: string,
        dto: CreateServiceDto,
    ) {
        const service = await this.serviceRepo.findOne({
            where: {
                id: serviceId,
            },
        });

        if (!service) {
            throw new NotFoundException(
                "Service not found",
            );
        }

        service.serviceName = dto.serviceName;
        service.price = dto.price;
        service.duration = dto.duration;
        service.description = dto.description;

        service.commissionType = dto.commissionType;

        if (dto.commissionType === CommissionType.FIXED) {
            service.commissionAmount = dto.commissionAmount;
            service.commissionPercentage = null;
            service.maxCommissionAmount = null;
        } else if (
            dto.commissionType === CommissionType.PERCENTAGE
        ) {
            service.commissionAmount = null;
            service.commissionPercentage =
                dto.commissionPercentage;
            service.maxCommissionAmount =
                dto.maxCommissionAmount;
        } else {
            service.commissionAmount = null;
            service.commissionPercentage = null;
            service.maxCommissionAmount = null;
        }

        await this.serviceRepo.save(service);

        return {
            message: "Service updated successfully",
            service,
        };
    }

    async remove(
        branchId: string,
        serviceId: string,
    ) {
        const result = await this.serviceRepo.delete({
            id: serviceId,
            branch: {
                id: branchId,
            },
        });

        if (!result.affected) {
            throw new NotFoundException(
                'Service not found',
            );
        }

        return {
            message: 'Service deleted successfully',
        };
    }
}