import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { AppDataSource } from '../data-source';

import { seedCategories } from './category.seed';

AppDataSource.initialize()
    .then(async () => {

        await seedCategories(
            AppDataSource,
        );

        process.exit();
    });"scripts": {
  "seed": "ts-node src/seeds/seed.ts"
}