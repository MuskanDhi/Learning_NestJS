import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GoodReceiptNoteService } from './good_receipt_note.service';
import { CreateGoodsReceiptNoteDto } from './dto/create-good_receipt_note.dto';

@Controller('branches/:branchId/good-receipt-note')
export class GoodReceiptNoteController {
  constructor(private readonly goodReceiptNoteService: GoodReceiptNoteService) { }
  @Post()
  create(
    @Param('branchId') branchId: string,
    @Body() dto: CreateGoodsReceiptNoteDto,
  ) {
    return this.goodReceiptNoteService.create(
      branchId,
      dto,
    );
  }
}
