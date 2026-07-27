import {
    IsArray,
    IsNotEmpty,
    IsOptional,
} from 'class-validator';

export class CreatePackageDto {

    @IsNotEmpty()
    packageName: string;

    @IsNotEmpty()
    originalPrice: number;

    @IsNotEmpty()
    offeredPrice: number;

    @IsNotEmpty()
    duration: number;

    @IsNotEmpty()
    unit: string;

    @IsArray()
    serviceIds: string[];
}