import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';

import {
    InjectRepository,
} from '@nestjs/typeorm';

import {
    Repository,
} from 'typeorm';

import { SubCategory } from './entities/sub-category.entity';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { Category } from 'src/categories/entities/category.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Salon } from 'src/salons/entities/salon.entity';

@Injectable()
export class SubCategoriesService {

    constructor(
        @InjectRepository(SubCategory)
        private subcategoryRepo: Repository<SubCategory>,

        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,

        @InjectRepository(Salon)
        private salonRepository: Repository<Salon>,
    ) { }

    async create(
        categoryId: string,
        dto: CreateSubCategoryDto,
    ) {

        const category =
            await this.categoryRepo.findOne({
                where: {
                    id: categoryId,
                },
            });

        if (!category) {
            throw new BadRequestException(
                'category not found',
            );
        }

        const existingSubCategory =
            await this.subcategoryRepo.findOne({
                where: {
                    name: dto.name,
                    category: {
                        id: categoryId,
                    },
                },
                relations: {
                    category: true,
                },
            });

        if (existingSubCategory) {
            throw new BadRequestException(
                'SubCategory already exists',
            );
        }

        const subcategory =
            this.subcategoryRepo.create({
                ...dto,
                category,
            });

        await this.subcategoryRepo.save(
            subcategory,
        );

        return {

            message:
                'SubCategory Added successfully',

            category: {
                ...category,

                subcategory: [
                    subcategory,
                ],
            },
        };
    }

    // async findBySalon(
    //     salonId: string,
    // ) {

    //     const salon =
    //         await this.salonRepository.findOne({
    //             where: {
    //                 id: salonId,
    //             },
    //             relations: {
    //                 branches: {
    //                     categories: {
    //                         subCategories: {
    //                             services: true,
    //                         },
    //                     },
    //                 },
    //             },
    //         });

    //     if (!salon) {
    //         throw new NotFoundException(
    //             'Salon not found',
    //         );
    //     }

    //     return {
    //         salons: salon,
    //     };
    // }

    async findByCategory(
        categoryId: string,
    ) {
        const category =
            await this.categoryRepo.findOne({
                where: {
                    id: categoryId,
                },
                relations: {
                    branch: {
                        salon: true,
                    },
                    subCategories: {
                        services: true,
                    },
                },
            });

        if (!category) {
            throw new NotFoundException(
                'Category not found',
            );
        }

        return {
            salon: {
                ...category.branch.salon,
                branches: {
                    ...category.branch,
                    salon: undefined,
                    categories: {
                        id: category.id,
                        name: category.name,
                        subCategories:
                            category.subCategories,
                    },
                },
            },
        };
    }

    async update(
        subcategoryId: string,
        body,
        userId: string,
    ) {
        const subcategory =
            await this.subcategoryRepo.findOne({
                where: {
                    id: subcategoryId,
                },
                relations: {
                    category: {
                        branch: {
                            salon: {
                                user: true,
                            },
                        },
                    },
                },
            });

        if (!subcategory) {
            throw new NotFoundException(
                'SubCategory not found',
            );
        }

        if (
            subcategory.category.branch.salon.user.id !==
            userId
        ) {
            throw new BadRequestException(
                'This subcategory does not belong to you',
            );
        }

        Object.assign(subcategory, body);

        const updatedSubCategory =
            await this.subcategoryRepo.save(
                subcategory,
            );

        return {
            message:
                'SubCategory updated successfully',
            category: updatedSubCategory,
        };
    }

    async remove(
        subcategoryId: string,
        userId: string,
    ) {
        const subcategory =
            await this.subcategoryRepo.findOne({
                where: {
                    id: subcategoryId,
                },
                relations: {
                    category: {
                        branch: {
                            salon: {
                                user: true,
                            },
                        },
                    },
                },
            });

        if(!subcategory){
            throw new NotFoundException(
                'subcategory not found',
            );
        }

        if(subcategory.category.branch.salon.user.id !== userId){
            throw new BadRequestException(
                'This subcategory does not belong to you',
            );
        }

        await this.subcategoryRepo.remove(
            subcategory,
        );

        return {
            message:
                'SubCategory deleted successfully',
        };
    }

}