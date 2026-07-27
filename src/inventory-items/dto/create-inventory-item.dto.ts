import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateInventoryItemDto {

    @IsString()
    @IsNotEmpty()
    itemName: string;

    @IsString()
    @IsNotEmpty()
    brand: string;

    @Type(() => Number)
    @IsNumber()
    stockLevel: number;

    @Type(() => Number)
    @IsNumber()
    costPerUnit: number;
}