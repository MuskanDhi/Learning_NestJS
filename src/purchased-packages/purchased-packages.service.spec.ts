import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedPackagesService } from './purchased-packages.service';

describe('PurchasedPackagesService', () => {
  let service: PurchasedPackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasedPackagesService],
    }).compile();

    service = module.get<PurchasedPackagesService>(PurchasedPackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

