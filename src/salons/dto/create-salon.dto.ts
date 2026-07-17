import {
    IsNotEmpty,
    IsArray,
    IsOptional,
    IsString,
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

    @IsOptional()
    @IsString()
    flatNo?: string;

    @IsOptional()
    @IsString()
    street?: string;

    @IsNotEmpty()
    country: string;

    @IsArray()
    schedule: any[];
}