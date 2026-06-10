import { Test, TestingModule } from '@nestjs/testing';
import { SalonBranchService } from './salon-branch.service';

describe('SalonBranchService', () => {
  let service: SalonBranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalonBranchService],
    }).compile();

    service = module.get<SalonBranchService>(SalonBranchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

