import { AppDataSource } from '../data-source';

import { seedCategories } from './category.seed';

AppDataSource.initialize()
    .then(async () => {

        await seedCategories(
            AppDataSource,
        );

        process.exit();
    });