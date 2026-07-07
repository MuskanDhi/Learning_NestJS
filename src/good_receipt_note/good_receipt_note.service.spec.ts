import { Test, TestingModule } from '@nestjs/testing';
import { GoodReceiptNoteService } from './good_receipt_note.service';

describe('GoodReceiptNoteService', () => {
  let service: GoodReceiptNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoodReceiptNoteService],
    }).compile();

    service = module.get<GoodReceiptNoteService>(GoodReceiptNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
