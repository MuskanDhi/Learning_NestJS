import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedDealsService } from './purchased-deals.service';

describe('PurchasedDealsService', () => {
  let service: PurchasedDealsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasedDealsService],
    }).compile();

    service = module.get<PurchasedDealsService>(PurchasedDealsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

