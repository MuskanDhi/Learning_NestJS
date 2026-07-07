import { Test, TestingModule } from '@nestjs/testing';
import { GoodReceiptNoteController } from './good_receipt_note.controller';
import { GoodReceiptNoteService } from './good_receipt_note.service';

describe('GoodReceiptNoteController', () => {
  let controller: GoodReceiptNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoodReceiptNoteController],
      providers: [GoodReceiptNoteService],
    }).compile();

    controller = module.get<GoodReceiptNoteController>(GoodReceiptNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
