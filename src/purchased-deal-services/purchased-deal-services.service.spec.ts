import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedDealServicesService } from './purchased-deal-services.service';

describe('PurchasedDealServicesService', () => {
  let service: PurchasedDealServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasedDealServicesService],
    }).compile();

    service = module.get<PurchasedDealServicesService>(PurchasedDealServicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
