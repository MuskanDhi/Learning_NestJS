import { Test, TestingModule } from '@nestjs/testing';
import { PurchasedDealServicesController } from './purchased-deal-services.controller';
import { PurchasedDealServicesService } from './purchased-deal-services.service';

describe('PurchasedDealServicesController', () => {
  let controller: PurchasedDealServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasedDealServicesController],
      providers: [PurchasedDealServicesService],
    }).compile();

    controller = module.get<PurchasedDealServicesController>(PurchasedDealServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
