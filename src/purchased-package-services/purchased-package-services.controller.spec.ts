import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedPackageServicesController } from './purchased-package-services.controller';
import { PurchasedPackageServicesService } from './purchased-package-services.service';

describe('PurchasedPackageServicesController', () => {
  let controller: PurchasedPackageServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasedPackageServicesController],
      providers: [PurchasedPackageServicesService],
    }).compile();

    controller = module.get<PurchasedPackageServicesController>(PurchasedPackageServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
