import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { Service } from 'src/services/entities/services.entity';
import { In, Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';
import { CreateDealDto } from './dto/create-deal.dto';

@Injectable()
export class DealsService {
    constructor(

        @InjectRepository(Branch)
        private branchRepo: Repository<Branch>,

        @InjectRepository(Service)
        private serviceRepo: Repository<Service>,

        @InjectRepository(Deal)
        private dealRepo: Repository<Deal>,
    ) { }
    async create(
        branchId: string,
        dto: CreateDealDto,
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

        if(invalidService){
            throw new BadRequestException(
                'Selected service does not belong to this branch',
            );
        }

        const deal = 
            await this.dealRepo.save(
                this.dealRepo.create({
                    dealName:
                        dto.dealName,
                    
                    originalPrice:
                        dto.originalPrice,

                    offeredPrice:
                        dto.offeredPrice,
                    
                    startDate:
                        dto.startDate,

                    endDate:
                        dto.endDate,
                    
                    branch,

                    services,
                    
                }),
            );

        return {
            message:
                'Deal created successfully',

            branch: {
                ...branch,

                deal: deal,
            },
        };
    }

    async findByBranch(branchId: string){

        const branch = 
             await this.branchRepo.findOne({
                where:{
                    id: branchId,
                },
             });

        if(!branch){
            throw new NotFoundException(
                'Branch not found',
            );
        }

        const deals = 
            await this.dealRepo.find({
                where:{
                    branch:{
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
                deals: deals.map(
                    ({ branch, ...member}) => member
                )
            }
        }
    }

    async update(
        dealId: string,
        body,
        userId: string,
    ) {
        const deal =
            await this.dealRepo.findOne({
                where: {
                    id: dealId,
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

        if (!deal) {
            throw new NotFoundException(
                'Deal not found',
            );
        }

        if (deal.branch.salon.user.id !== userId) {
            throw new BadRequestException(
                "This Deal does not belong to you",
            );
        }

        if (body.serviceIds) {
        const services =
            await this.serviceRepo.find({
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

        const invalidService =
            services.find(
                (service) =>
                    service.subCategory
                        .category
                        .branch
                        .id !== deal.branch.id,
            );

        if (invalidService) {
            throw new BadRequestException(
                'Selected service does not belong to this branch',
            );
        }

        deal.services = services;
    }

    delete body.serviceIds;

        Object.assign(deal, body);

        const updatedDealCategory =
            await this.dealRepo.save(
                deal,
            );

        return {
            message:
                'Deal updated successfully',
            package: updatedDealCategory,
        };
    }

    async remove(
        dealId: string,
        userId: string,
    ) {
        const deal =
            await this.dealRepo.findOne({
                where: {
                    id: dealId,
                },
                relations: {
                    branch: {
                        salon: {
                            user: true,
                        },
                    },
                },
            });

        if (!deal) {
            throw new NotFoundException(
                'Deal not found',
            );
        }

        if (
            deal.branch.salon.user.id !==
            userId
        ) {
            throw new BadRequestException(
                'This deal does not belong to you',
            );
        }

        await this.dealRepo.remove(
            deal,
        );

        return {
            message:
                'Deal deleted successfully',
        };

    }
}
