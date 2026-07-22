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

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Branch } from 'src/branches/entities/branch.entity';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,

        @InjectRepository(Branch)
        private branchRepo: Repository<Branch>,
    ) { }

    async create(
        branchId: string,
        dto: CreateCategoryDto,
    ) {

        const branch =
            await this.branchRepo.findOne({
                where: {
                    id: branchId,
                },
            });

        if (!branch) {
            throw new BadRequestException(
                'Branch not found',
            );
        }

        if (!dto || !dto.name) {
            throw new BadRequestException(
                'Category name is required.',
            );
        }

        const existingCategory =
            await this.categoryRepo.findOne({
                where: {
                    name: dto.name,
                    branch: {
                        id: branchId,
                    },
                },
                relations: {
                    branch: true,
                },
            });

        if (existingCategory) {
            throw new BadRequestException(
                'Category already exists',
            );
        }

        const category =
            this.categoryRepo.create({
                ...dto,
                branch,
            });

        await this.categoryRepo.save(
            category,
        );

        return {

            message:
                'Category Added successfully',

            branch: {
                ...branch,

                category: [
                    category,
                ],
            },
        };
    }

    //Get

    async findByBranch(
        branchId: string,
    ) {
        const branch =
            await this.branchRepo.findOne({
                where: {
                    id: branchId,
                },
                relations: {
                    salon: true,
                    categories: {
                        subCategories: {
                            services: true,
                        },
                    },
                },
            });

        if (!branch) {
            throw new NotFoundException(
                'Branch not found',
            );
        }

        return {
            salon: {
                id: branch.salon.id,
                name: branch.salon.name,
                branches: {
                    ...branch,
                    salon: undefined,
                },
            },
        };
    }

    // UPDATE CATEGORY
    async update(
        categoryId: string,
        body,
        userId: string,
    ) {
        const category =
            await this.categoryRepo.findOne({
                where: {
                    id: categoryId,
                },
                relations: {
                    branch: {
                        salon: {
                            user: true,
                        },
                    },
                },
            });

        if (!category) {
            throw new NotFoundException(
                'Category not found',
            );
        }

        if (
            category.branch.salon.user.id !==
            userId
        ) {
            throw new BadRequestException(
                'This category does not belong to you',
            );
        }

        Object.assign(category, body);

        const updatedCategory =
            await this.categoryRepo.save(
                category,
            );

        return {
            message:
                'Category updated successfully',
            category: updatedCategory,
        };
    }

    // async remove(
    //     categoryId: string,
    //     userId: string,
    // ) {
    //     const category =
    //         await this.categoryRepo.findOne({
    //             where: {
    //                 id: categoryId,
    //             },
    //             relations: {
    //                 branch: {
    //                     salon: {
    //                         user: true,
    //                     },
    //                 },
    //             },
    //         });

    //     if (!category) {
    //         throw new NotFoundException(
    //             'Category not found',
    //         );
    //     }

    //     if (
    //         category.branch.salon.user.id !==
    //         userId
    //     ) {
    //         throw new BadRequestException(
    //             'This category does not belong to you',
    //         );
    //     }

    //     await this.categoryRepo.remove(
    //         category,
    //     );

    //     return {
    //         message:
    //             'Category deleted successfully',
    //     };

    // }

    async remove(
        categoryId: string,
        userId: string,
    ) {
        const category = await this.categoryRepo.findOne({
            where: {
                id: categoryId,
            },
            relations: {
                subCategories: {
                    services: true,
                },
                branch: {
                    salon: {
                        user: true,
                    },
                },
            },
        });

        if (!category) {
            throw new NotFoundException(
                'Category not found',
            );
        }

        if (
            category.branch.salon.user.id !==
            userId
        ) {
            throw new BadRequestException(
                'This category does not belong to you',
            );
        }

        // Category has subcategories
        if (category.subCategories.length > 0) {
            throw new BadRequestException(
                "This category can't be deleted because it contains active subcategories or services. Please delete the active subcategories/services first, then try again.",
            );
        }

        await this.categoryRepo.remove(category);

        return {
            message:
                'Category deleted successfully',
        };

    }

}

