import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateDealDto } from './dto/create-deal.dto';

@Controller()
export class DealsController {
    constructor(
        private dealsService: DealsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('branches/:branchId/deals')
    create(
        @Param('branchId') branchId: string,
        @Body() dto: CreateDealDto,
    ) {
        return this.dealsService.create(
            branchId,
            dto
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('branches/:branchId/deals')
    findByBranch(
        @Param('branchId') branchId: string,
    ) {
        return this.dealsService.findByBranch(
            branchId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch('branches/:branchId/deals/:id/override')
    update(
        @Param('id') id: string,
        @Body() body,
        @Req() req,
    ) {
        return this.dealsService.update(
            id,
            body,
            req.user.id,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete('branches/:branchId/deals/:id')
    remove(
        @Param('id') id: string,
        @Req() req,
    ) {
        return this.dealsService.remove(
            id,
            req.user.id,
        )
    }
}