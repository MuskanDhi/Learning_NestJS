import { Module } from '@nestjs/common';
import { TeamMembersController } from './team-members.controller';
import { TeamMembersService } from './team-members.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/services/entities/services.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { TeamMember } from './entities/team-member.entity';
import { TeamMemberSchedule } from 'team-member-schedules';

@Module({
        imports: [
          TypeOrmModule.forFeature([
              Service,
              Branch,
              TeamMember,
              TeamMemberSchedule
          ]),
          AuthModule
      ],
  controllers: [TeamMembersController],
  providers: [TeamMembersService]
})
export class TeamMembersModule {}
