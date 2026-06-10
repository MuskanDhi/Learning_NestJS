import {
    Controller,
    Post,
    Body,
    Get,
    Req,
    Param,
    Patch,
    Delete,
} from '@nestjs/common';

import { SalonsService } from './salons.service';
import {
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
    from '../auth/jwt-auth.guard';
import { CreateSalonDto } from './dto/create-salon.dto';
@Controller('salons')
export class SalonsController {
    constructor(
        private salonsService: SalonsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(
        @Body() dto: CreateSalonDto,
        @Req() req,
    ) {
        return this.salonsService.create(
            dto,
            req.user.id,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    findSalonsByUser(
        @Param('userId') userId: string,
    ) {
        return this.salonsService.findMySalons(
            userId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body,
        @Req() req,
    ) {
        return this.salonsService.update(
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
        return this.salonsService.remove(
            id,
            req.user.id,
        );
    }
}
