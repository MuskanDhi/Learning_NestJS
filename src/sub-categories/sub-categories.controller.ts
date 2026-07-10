import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { SubCategoriesService } from './sub-categories.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('branch/:branchId')
export class SubCategoriesController {

    constructor(
        private readonly subcategoriesService: SubCategoriesService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('category/:categoryId/sub-category/add')
    create(
        @Param('categoryId') categoryId: string,
        @Body() dto: CreateSubCategoryDto,
    ) {
        return this.subcategoriesService.create(
            categoryId,
            dto,
        );
    }

    // @Get(':salonId')
    // findBySalon(
    //     @Param('salonId') salonId: string,
    // ){
    //     return this.subcategoriesService.findBySalon(
    //         salonId
    //     );
    // }

    // @UseGuards(JwtAuthGuard)
    // @Get(':categoryId')
    // findByCategory(
    //     @Param('categoryId') categoryId: string,
    // ) {
    //     return this.subcategoriesService.findByCategory(
    //         categoryId
    //     )
    // }

    @UseGuards(JwtAuthGuard)
    @Patch('category/:categoryId/sub-category/:id')
    update(
        @Param('id') id: string,
        @Body() body,
        @Req() req,
    ) {
        return this.subcategoriesService.update(
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
    ) {
        return this.subcategoriesService.remove(
            id,
            req.user.id,
        );
    }

}