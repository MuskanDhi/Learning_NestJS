import {
    IsNotEmpty,
    IsArray,
} from 'class-validator';

export class CreateSalonDto {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    openingTime: string;

    @IsNotEmpty()
    closingTime: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsNotEmpty()
    aboutUs: string;

    @IsNotEmpty()
    flatNo: string;

    @IsNotEmpty()
    street: string;

    @IsNotEmpty()
    village: string;

    @IsNotEmpty()
    district: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    state: string;

    @IsNotEmpty()
    country: string;

    @IsNotEmpty()
    postalCode: string;

    @IsArray()
    schedule: any[];
}