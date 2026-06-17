import { IsArray, IsNotEmpty } from 'class-validator';
export class CreateDealDto {

    @IsNotEmpty()
    dealName: string;

    @IsNotEmpty()
    offeredPrice: string;

    @IsNotEmpty()
    startDate: string;

    @IsNotEmpty()
    endDate: string;

    @IsArray()
    serviceIds: string[];
}

