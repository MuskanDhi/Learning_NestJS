import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConstantsService } from './constants.service';
import { CreateConstantDto } from './dto/create-role-specialty.dto';

@Controller('constants')
export class ConstantsController {
    constructor(
        private readonly constantsService: ConstantsService,
    ) { }

    @Get()
    getConstants() {
        return this.constantsService.getConstants();
    }

    @Post()
    create(
        @Body() dto: CreateConstantDto,
    ) {
        return this.constantsService.create(dto);
    }
}