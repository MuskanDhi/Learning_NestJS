import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedOrderController } from './purchased-order.controller';
import { PurchasedOrderService } from './purchased-order.service';

describe('PurchasedOrderController', () => {
  let controller: PurchasedOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasedOrderController],
      providers: [PurchasedOrderService],
    }).compile();

    controller = module.get<PurchasedOrderController>(PurchasedOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
