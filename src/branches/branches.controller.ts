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
    Post,
    ParseUUIDPipe
} from '@nestjs/common';

import { BranchesService } from './branches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBranchDto } from './dto/create-branch.dto';

@Controller('salons/:salonId')
export class BranchesController {
    constructor(
        private branchesService: BranchesService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('branches')
    create(
        @Param('salonId', ParseUUIDPipe) salonId: string,

        @Body() dto: CreateBranchDto,
    ) {
        return this.branchesService.create(
            salonId,
            dto,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('myBranches')
    findBySalon(
        @Param('salonId') salonId: string,
    ) {
        return this.branchesService.findBySalon(
            salonId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch('branch/:branchId')
    update(
        @Param('branchId') id: string,
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
    @Delete('branch/:branchId/remove')
    remove(
        @Param('branchId') id: string,
        @Req() req,
    ) {
        return this.branchesService.remove(
            id,
            req.user.id,
        );
    }

    @Get('branch/:branchId/slots')
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

