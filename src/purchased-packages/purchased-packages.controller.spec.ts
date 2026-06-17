import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedPackagesController } from './purchased-packages.controller';
import { PurchasedPackagesService } from './purchased-packages.service';

describe('PurchasedPackagesController', () => {
  let controller: PurchasedPackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasedPackagesController],
      providers: [PurchasedPackagesService],
    }).compile();

    controller = module.get<PurchasedPackagesController>(PurchasedPackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
