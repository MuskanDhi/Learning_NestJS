import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';

@Controller('packages')
export class PackagesController {

    constructor(
        private packagesService: PackagesService,
    ){ }

    @UseGuards(JwtAuthGuard)
    @Post(':branchId')
    create(
        @Param('branchId') branchId: string,
        @Body() dto: CreatePackageDto,
    ){
        return this.packagesService.create(
            branchId,
            dto
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':branchId')
    findByBranch(
        @Param('branchId') branchId: string,
    ){
        return this.packagesService.findByBranch(
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
        return this.packagesService.update(
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
        return this.packagesService.remove(
            id,
            req.user.id,
        )
    }
}