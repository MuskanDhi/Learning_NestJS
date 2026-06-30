import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {

    constructor(
        private readonly reportsService: ReportsService,
    ){}

    @UseGuards(JwtAuthGuard)
    @Get()
    getDashBoardReport(
        @Query('branchId') branchId: string,
        @Query('dateRange') dateRange: string,
    ){
        return this.reportsService.getDashBoardReport(
            branchId,
            dateRange
        );
    }
}
