import { Test, TestingModule } from '@nestjs/testing';
import { AddServicesIntoCartService } from './add-services-into-cart.service';

describe('AddServicesIntoCartService', () => {
  let service: AddServicesIntoCartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddServicesIntoCartService],
    }).compile();

    service = module.get<AddServicesIntoCartService>(AddServicesIntoCartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
