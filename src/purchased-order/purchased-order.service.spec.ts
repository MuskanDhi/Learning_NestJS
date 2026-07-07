import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedOrderService } from './purchased-order.service';

describe('PurchasedOrderService', () => {
  let service: PurchasedOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasedOrderService],
    }).compile();

    service = module.get<PurchasedOrderService>(PurchasedOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
