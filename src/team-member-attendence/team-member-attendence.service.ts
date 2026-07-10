import { Injectable } from '@nestjs/common';
import { CreateTeamMemberAttendenceDto } from './dto/create-team-member-attendence.dto';
import { UpdateTeamMemberAttendenceDto } from './dto/update-team-member-attendence.dto';

@Injectable()
export class TeamMemberAttendenceService {
  create(createTeamMemberAttendenceDto: CreateTeamMemberAttendenceDto) {
    return 'This action adds a new teamMemberAttendence';
  }

  findAll() {
    return `This action returns all teamMemberAttendence`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teamMemberAttendence`;
  }

  update(id: number, updateTeamMemberAttendenceDto: UpdateTeamMemberAttendenceDto) {
    return `This action updates a #${id} teamMemberAttendence`;
  }

  remove(id: number) {
    return `This action removes a #${id} teamMemberAttendence`;
  }
}
