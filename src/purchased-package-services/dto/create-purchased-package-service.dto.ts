import { IsNotEmpty } from 'class-validator';

export class CreatePurchasedPackageServiceDto {

    @IsNotEmpty()
    purchasedPackageId: string;

    @IsNotEmpty()
    serviceId: string;
}