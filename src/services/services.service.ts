import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Service } from '../services/entities/services.entity';

import { Branch } from 'src/branches/entities/branch.entity';

import { CreateServiceDto } from './dto/create-service.dto';
import { SubCategory } from 'src/sub-categories/entities/sub-category.entity';

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
        // const subCategory =
        //     await this.subCategoryRepo.findOne({
        //         where: {
        //             id: subCategoryId,
        //         },
        //         relations: {
        //             category: true,
        //         },
        //     });
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
        console.log('Branch ID:', subCategory.category.branch?.id);

        const service =
            this.serviceRepo.create({
                serviceName: dto.serviceName,
                price: dto.price,
                duration: dto.duration,
                description: dto.description,
                subCategory,
                category: subCategory.category, 
                branch: subCategory.category.branch,
            });

        await this.serviceRepo.save(service);

        console.log(service);

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
                        },
                    ],
                },
            },
        };
    }
}