import { Module } from '@nestjs/common';
import { TeamMemberAttendenceService } from './team-member-attendence.service';
import { TeamMemberAttendenceController } from './team-member-attendence.controller';

@Module({
  controllers: [TeamMemberAttendenceController],
  providers: [TeamMemberAttendenceService],
})
export class TeamMemberAttendenceModule {}
