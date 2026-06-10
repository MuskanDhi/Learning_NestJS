import {
    Body,
    Controller,
    Post,
    Get,
    UseGuards,
    Param,
    Patch,
    Req,
    Delete,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post(':branchId')
    create(
        @Param('branchId') branchId: string,
        @Body() dto: CreateCategoryDto,
    ) {
        return this.categoriesService.create(
            branchId,
            dto,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':branchId')
    findByBranch(
        @Param('branchId') branchId: string,
    ) {
        return this.categoriesService.findByBranch(
            branchId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body,
        @Req() req,
    ){
        return this.categoriesService.update(
            id,
            body,
            req.user.id,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(
        @Param('id') id: string,
        @Req() req,
    ){
        return this.categoriesService.remove(
            id,
            req.user.id,
        );
    }

}