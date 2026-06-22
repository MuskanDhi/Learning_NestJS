import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchasedDealsService } from './purchased-deals.service';
@Controller('purchased-deals')
export class PurchasedDealsController {
  constructor(private readonly purchasedDealsService: PurchasedDealsService) { }

}
