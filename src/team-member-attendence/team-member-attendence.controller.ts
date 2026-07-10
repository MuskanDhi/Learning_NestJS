import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeamMemberAttendenceService } from './team-member-attendence.service';
import { CreateTeamMemberAttendenceDto } from './dto/create-team-member-attendence.dto';
import { UpdateTeamMemberAttendenceDto } from './dto/update-team-member-attendence.dto';

@Controller('team-member-attendence')
export class TeamMemberAttendenceController {
  constructor(private readonly teamMemberAttendenceService: TeamMemberAttendenceService) {}

  @Post()
  create(@Body() createTeamMemberAttendenceDto: CreateTeamMemberAttendenceDto) {
    return this.teamMemberAttendenceService.create(createTeamMemberAttendenceDto);
  }

  @Get()
  findAll() {
    return this.teamMemberAttendenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMemberAttendenceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamMemberAttendenceDto: UpdateTeamMemberAttendenceDto) {
    return this.teamMemberAttendenceService.update(+id, updateTeamMemberAttendenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamMemberAttendenceService.remove(+id);
  }
}
