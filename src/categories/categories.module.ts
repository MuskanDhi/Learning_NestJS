import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AuthModule } from 'src/auth/auth.module';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Branch
    ]),
    AuthModule,
  ],
  controllers: [
    CategoriesController,
  ],
  providers: [
    CategoriesService,
  ],
})
export class CategoriesModule { }