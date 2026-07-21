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

    @IsOptional()
    @IsString()
    Commission_type?: string;

    @IsOptional()
    @IsString()
    amount?: string;

    @IsOptional()
    @IsString()
    percentage?: string;

    @IsOptional()
    @IsString()
    max_amount?: string;
}