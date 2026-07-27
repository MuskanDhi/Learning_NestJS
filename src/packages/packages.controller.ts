import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';

@Controller()
export class PackagesController {

    constructor(
        private packagesService: PackagesService,
    ){ }

    @UseGuards(JwtAuthGuard)
    @Post('branches/:branchId/offers')
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
    @Get('branches/:branchId/offers')
    findByBranch(
        @Param('branchId') branchId: string,
    ){
        return this.packagesService.findByBranch(
            branchId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch('branches/:branchId/offers/:id/override')
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
    @Delete('branches/:branchId/offers/packages/:id')
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