import {
    Body,
    Controller,
    Param,
    Post,
} from '@nestjs/common';

import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
export class ServicesController {
    constructor(
        private readonly service: ServicesService,
    ) { }

    @Post(':subCategoryId')
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
}

