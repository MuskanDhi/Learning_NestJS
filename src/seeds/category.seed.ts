import { DataSource } from 'typeorm';

import { Category } from '../categories/entities/category.entity';

import { SubCategory } from '../sub-categories/entities/sub-category.entity';

import { Service } from '../services/entities/services.entity';

export async function seedCategories(
    dataSource: DataSource,
) {

    const categoryRepo =
        dataSource.getRepository(Category);

    const subCategoryRepo =
        dataSource.getRepository(SubCategory);

    const serviceRepo =
        dataSource.getRepository(Service);

    // =========================
    // HAIR CATEGORY
    // =========================

    const hair =
        await categoryRepo.save({
            name: 'Hair',
        });

    const hairCut =
        await subCategoryRepo.save({
            name: 'Hair Cut',
            category: hair,
        });

    const hairSpa =
        await subCategoryRepo.save({
            name: 'Hair Spa',
            category: hair,
        });


    await serviceRepo.save([
        {
            serviceName: 'Normal Hair Cut',
            price: 300,
            duration: '30 min',
            description: 'Basic Hair Cut',
            subCategory: hairCut,
        },

        {
            serviceName: 'Premium Hair Cut',
            price: 700,
            duration: '45 min',
            description: 'Premium Hair Cut',
            subCategory: hairCut,
        },

        {
            serviceName: 'Keratin Hair Spa',
            price: 1200,
            duration: '60 min',
            description: 'Hair Spa Treatment',
            subCategory: hairSpa,
        },
    ]);

    // =========================
    // SKIN CATEGORY
    // =========================

    const skin =
        await categoryRepo.save({
            name: 'Skin',
        });

    const facial =
        await subCategoryRepo.save({
            name: 'Facial',
            category: skin,
        });

    await serviceRepo.save([
        {
            serviceName: 'Gold Facial',
            price: 1500,
            duration: '60 min',
            description: 'Gold Facial Treatment',
            subCategory: facial,
        },

        {
            serviceName: 'Detan Facial',
            price: 1000,
            duration: '45 min',
            description: 'Detan Treatment',
            subCategory: facial,
        },
    ]);

    console.log(
        'Categories, SubCategories and Services Seeded',
    );
}