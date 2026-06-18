import { Test, TestingModule } from '@nestjs/testing';
import { AddServicesIntoCartController } from './add-services-into-cart.controller';
import { AddServicesIntoCartService } from './add-services-into-cart.service';

describe('AddServicesIntoCartController', () => {
  let controller: AddServicesIntoCartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddServicesIntoCartController],
      providers: [AddServicesIntoCartService],
    }).compile();

    controller = module.get<AddServicesIntoCartController>(AddServicesIntoCartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
