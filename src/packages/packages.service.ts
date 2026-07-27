import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from '../branches/entities/branch.entity';
import { Service } from '../services/entities/services.entity';
import { Package } from './entities/package.entity';

@Injectable()
export class PackagesService {
    constructor(

        @InjectRepository(Branch)
        private branchRepo: Repository<Branch>,

        @InjectRepository(Service)
        private serviceRepo: Repository<Service>,

        @InjectRepository(Package)
        private packageRepo: Repository<Package>,
    ) { }

    async create(
        branchId: string,
        dto: CreatePackageDto,
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

        const originalPrice = services.reduce(
            (sum, service) =>
                sum + Number(service.price),
            0,
        );

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

        const pkg =
            await this.packageRepo.save(
                this.packageRepo.create({
                    packageName:
                        dto.packageName,

                    // originalPrice:
                    //     originalPrice.toString(),
                    originalPrice,

                    offeredPrice:
                        dto.offeredPrice,

                    duration:
                        dto.duration,

                    unit:
                        dto.unit,

                    branch,

                    services,
                }),
            );

        return {
            message:
                'Package created successfully',

            branch: {
                ...branch,

                package: pkg,
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

        const packages =
            await this.packageRepo.find({
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
                packages: packages.map(
                    ({ branch, ...member }) => member
                )
            }
        }
    }

    async update(
        packageId: string,
        body,
        userId: string,
    ) {
        const packages =
            await this.packageRepo.findOne({
                where: {
                    id: packageId,
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

        if (!packages) {
            throw new NotFoundException(
                'Package not found',
            );
        }

        if (packages.branch.salon.user.id !== userId) {
            throw new BadRequestException(
                "This package does not belong to you",
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
                services.length !==
                body.serviceIds.length
            ) {
                throw new BadRequestException(
                    'One or more services not found',
                );
            }

            const invalidService = services.find(
                (service) =>
                    service.subCategory
                        .category
                        .branch
                        .id !== packages.branch.id,
            );

            if (invalidService) {
                throw new BadRequestException(
                    'Selected service does not belong to this branch',
                );
            }

            packages.services = services;

            delete body.serviceIds;
        }

        Object.assign(packages, body);

        const updatedPackage =
            await this.packageRepo.save(
                packages,
            );

        return {
            message:
                'Package updated successfully',
            package: updatedPackage,
        };
    }

    async remove(
        packageId: string,
        userId: string,
    ) {
        const packages =
            await this.packageRepo.findOne({
                where: {
                    id: packageId,
                },
                relations: {
                    branch: {
                        salon: {
                            user: true,
                        },
                    },
                },
            });

        if (!packages) {
            throw new NotFoundException(
                'Package not found',
            );
        }

        if (
            packages.branch.salon.user.id !==
            userId
        ) {
            throw new BadRequestException(
                'This package does not belong to you',
            );
        }

        await this.packageRepo.remove(
            packages,
        );

        return {
            message:
                'Package deleted successfully',
        };

    }
}
