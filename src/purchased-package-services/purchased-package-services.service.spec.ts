import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedPackageServicesService } from './purchased-package-services.service';

describe('PurchasedPackageServicesService', () => {
  let service: PurchasedPackageServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasedPackageServicesService],
    }).compile();

    service = module.get<PurchasedPackageServicesService>(PurchasedPackageServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
