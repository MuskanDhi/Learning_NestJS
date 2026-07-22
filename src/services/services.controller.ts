import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('branches/:branchId')
export class ServicesController {
    constructor(
        private readonly service: ServicesService,
    ) { }

    @Post('subCategory/:subCategoryId/services')
    create(
        @Param('subCategoryId')
        subCategoryId: string,

        @Body()
        dto: CreateServiceDto,
    ) {
        return this.service.create(
            subCategoryId,
            dto,
        );
    }

    @Get('services')
    findAll(
        @Param('branchId')
        branchId: string,
    ) {
        return this.service.findAll(branchId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('services/:serviceId')
    update(
        @Param("serviceId") serviceId: string,

        @Body()
        dto: CreateServiceDto,
    ) {
        return this.service.update(
            serviceId,
            dto,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete('services/:serviceId')
    remove(
        @Param('branchId') branchId: string,
        @Param('serviceId') serviceId: string,
    ) {
        return this.service.remove(
            branchId,
            serviceId
        )
    }
}

