import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchasedOrderDto } from './create-purchased-order.dto';

export class UpdatePurchasedOrderDto extends PartialType(CreatePurchasedOrderDto) {}
