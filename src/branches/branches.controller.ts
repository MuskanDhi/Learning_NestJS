import {
    Controller,
    Body,
    Get,
    Param,
    UseGuards,
    Req,
    Patch,
    Delete,
    Query,
    Post
} from '@nestjs/common';

import { BranchesService } from './branches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBranchDto } from './dto/create-branch.dto';

@Controller('branches')
export class BranchesController {
    constructor(
        private branchesService: BranchesService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post(':salonId')
    create(
        @Param('salonId') salonId: string,

        @Body() dto: CreateBranchDto,
    ) {
        return this.branchesService.create(
            salonId,
            dto,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get(':salonId')
    findBySalon(
        @Param('salonId') salonId: string,
    ) {
        return this.branchesService.findBySalon(
            salonId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body,
        @Req() req,
    ) {
        return this.branchesService.update(
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
        return this.branchesService.remove(
            id,
            req.user.id,
        );
    }

    @Get(':branchId/slots')
    getSlots(
        @Param('branchId')
        branchId: string,

        @Query('day')
        day: string,
    ) {
        return this.branchesService.getSlots(
            branchId,
            day,
        );
    }
}

