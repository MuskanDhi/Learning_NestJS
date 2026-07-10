import {
    Controller,
    Post,
    Body,
    Get,
    Req,
    Param,
    Patch,
    Delete,
    ParseUUIDPipe,
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
    @Get('user/:userId/salons')
    findSalonsByUser(
        @Param('userId', ParseUUIDPipe) userId: string,
    ) {
        return this.salonsService.findMySalons(
            userId,
        );
    }

    @Get()
    getAllSalons() {
        return this.salonsService.getAllSalons();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
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
    @Delete(':salonId')
    remove(
        @Param('salonId', ParseUUIDPipe) id: string,
        @Req() req,
    ) {
        return this.salonsService.remove(
            id,
            req.user.id,
        );
    }
}
