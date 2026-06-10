import {
    IsString,
    IsNumber,
    IsOptional,
} from 'class-validator';

export class CreateServiceDto {

    @IsString()
    serviceName: string;

    @IsNumber()
    price: number;

    @IsString()
    duration: string;

    @IsOptional()
    @IsString()
    description?: string;
}