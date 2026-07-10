import { Test, TestingModule } from '@nestjs/testing';
import { TeamMemberAttendenceController } from './team-member-attendence.controller';
import { TeamMemberAttendenceService } from './team-member-attendence.service';

describe('TeamMemberAttendenceController', () => {
  let controller: TeamMemberAttendenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamMemberAttendenceController],
      providers: [TeamMemberAttendenceService],
    }).compile();

    controller = module.get<TeamMemberAttendenceController>(TeamMemberAttendenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
