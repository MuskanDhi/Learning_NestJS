import { IsNotEmpty, IsUUID } from "class-validator";

export class CreatePurchasedOrderDto {
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @IsNotEmpty()
  orderedQuantity: number;

  @IsNotEmpty()
  createdBy: string;

  @IsUUID()
  @IsNotEmpty()
  vendorId: string;
}