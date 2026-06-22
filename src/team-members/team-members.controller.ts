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

@Controller('team-members')
export class TeamMembersController {

    constructor(
        private teamMembersService: TeamMembersService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post(':branchId')
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
    @Get(':branchId')
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