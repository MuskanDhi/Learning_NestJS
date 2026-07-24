import {
    Controller,
    Post,
    Body,
    Req,
    UseGuards,
    Param,
    Get,
    Patch,
    Delete,
    Query,
} from '@nestjs/common';

import { TeamMembersService } from './team-members.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { CreateTeamMemberDto } from './dto/create-team-member.dto';

@Controller()
export class TeamMembersController {

    constructor(
        private teamMembersService: TeamMembersService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('branches/:branchId/team-members')
    create(
        @Param('branchId') branchId: string,
        @Body() dto: CreateTeamMemberDto,
    ) {
        return this.teamMembersService.create(
            branchId,
            dto,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post(':teamMemberId/branch/:branchId/check-in')
    checkIn(
        @Param('teamMemberId') teamMemberId: string,
        @Param('branchId') branchId: string,
    ) {
        return this.teamMembersService.checkIn(
            teamMemberId,
            branchId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post(':teamMemberId/branch/:branchId/check-out')
    checkOut(
        @Param('teamMemberId') teamMemberId: string,
        @Param('branchId') branchId: string,
    ) {
        return this.teamMembersService.checkOut(
            teamMemberId,
            branchId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Get('branches/:branchId/team-members')
    findByBranch(
        @Param('branchId') branchId: string,
    ) {
        return this.teamMembersService.findByBranch(
            branchId,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body,
        @Req() req,
    ) {
        return this.teamMembersService.update(
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
        return this.teamMembersService.remove(
            id,
            req.user.id,
        )
    }

    @UseGuards(JwtAuthGuard)
    @Get(':teamMemberId/available-slots')
    getAvailableSlots(
        @Param('teamMemberId')
        teamMemberId: string,

        @Query('date')
        date: string,
    ) {
        return this.teamMembersService.getAvailableSlots(
            teamMemberId,
            date,
        );
    }
}