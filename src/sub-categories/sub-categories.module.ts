import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { Category } from 'src/categories/entities/category.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Branch } from 'src/branches/entities/branch.entity';
import { Salon } from 'src/salons/entities/salon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubCategory,
      Category,
      Branch,
      Salon
    ]),
    AuthModule,
  ],
  providers: [SubCategoriesService],
  controllers: [SubCategoriesController]
})
export class SubCategoriesModule { }
