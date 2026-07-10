import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamMemberAttendenceDto } from './create-team-member-attendence.dto';

export class UpdateTeamMemberAttendenceDto extends PartialType(CreateTeamMemberAttendenceDto) {}
