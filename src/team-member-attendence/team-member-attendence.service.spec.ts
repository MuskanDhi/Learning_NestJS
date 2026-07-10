import { Test, TestingModule } from '@nestjs/testing';
import { TeamMemberAttendenceService } from './team-member-attendence.service';

describe('TeamMemberAttendenceService', () => {
  let service: TeamMemberAttendenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamMemberAttendenceService],
    }).compile();

    service = module.get<TeamMemberAttendenceService>(TeamMemberAttendenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
