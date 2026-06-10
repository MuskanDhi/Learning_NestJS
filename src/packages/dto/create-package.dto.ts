import {
    IsArray,
    IsNotEmpty,
} from 'class-validator';

export class CreatePackageDto {

    @IsNotEmpty()
    packageName: string;

    @IsNotEmpty()
    originalPrice: string;

    @IsNotEmpty()
    offeredPrice: string;

    @IsNotEmpty()
    duration: string;

    @IsNotEmpty()
    unit: string;

    @IsArray()
    serviceIds: string[];
}