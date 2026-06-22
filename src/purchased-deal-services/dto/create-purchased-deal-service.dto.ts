import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePurchasedDealServiceDto {

    @IsNotEmpty()
    purchasedDealId: string;

    @IsOptional()
    @IsString()
    serviceId?: string;

    @IsOptional()
    @IsArray()
    serviceIds?: string[];

    @IsNotEmpty()
    @IsString()
    teamMemberId: string;

    @IsNotEmpty()
    @IsString()
    appointmentDate: string;

    @IsNotEmpty()
    @IsString()
    startTime: string;
}
