import { Test, TestingModule } from '@nestjs/testing';
import { SalonBranchController } from './salon-branch.controller';

describe('SalonBranchController', () => {
  let controller: SalonBranchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalonBranchController],
    }).compile();

    controller = module.get<SalonBranchController>(SalonBranchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
