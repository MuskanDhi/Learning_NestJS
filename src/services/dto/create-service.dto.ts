// import {
//     IsString,
//     IsNumber,
//     IsOptional,
//     IsEnum,
// } from 'class-validator';
// import { CommissionType } from '../entities/commission-type.enum';

// export class CreateServiceDto {

//     @IsString()
//     serviceName: string;

//     @IsNumber()
//     price: number;

//     @IsString()
//     duration: string;

//     @IsOptional()
//     @IsString()
//     description?: string;

//     @IsOptional()
//     @IsEnum(CommissionType)
//     commissionType?: CommissionType;

//     @IsOptional()
//     @IsNumber()
//     commissionAmount?: number | null;

//     @IsOptional()
//     @IsNumber()
//     commissionPercentage?: number | null;

//     @IsOptional()
//     @IsNumber()
//     maxCommissionAmount?: number | null;
// }

import {
    IsString,
    IsNumber,
    IsOptional,
    IsEnum,
    IsNotEmpty,
    Min,
    IsDefined,
} from 'class-validator';

import {
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { Transform } from 'class-transformer';
import { CommissionType } from '../entities/commission-type.enum';

export class CreateServiceDto {

    @IsDefined({ message: 'Service name is required' })
    @IsNotEmpty({ message: 'Service name is required' })
    @IsString({ message: 'Service name must be a string' })
    serviceName: string;


    @IsDefined({ message: 'Price is required' })
    @Transform(({ value }) => {
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }
        return Number(value);
    })
    @IsNumber({}, { message: 'Price must be a number' })
    @Min(1, { message: 'Price must be greater than 0' })
    price: number;


    @IsDefined({ message: 'Duration is required' })
    @IsNotEmpty({ message: 'Duration is required' })
    @IsString({ message: 'Duration must be a string' })
    duration: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;

    @IsOptional()
    @IsEnum(CommissionType, {
        message: 'Invalid commission type',
    })
    commissionType?: CommissionType;


    @IsOptional()
    @Transform(({ value }) =>
        value === '' || value === null || value === undefined
            ? undefined
            : Number(value)
    )
    @IsNumber({}, { message: 'Commission amount must be a number' })
    commissionAmount?: number;


    @IsOptional()
    @Transform(({ value }) =>
        value === '' || value === null || value === undefined
            ? undefined
            : Number(value)
    )
    @IsNumber({}, { message: 'Commission percentage must be a number' })
    commissionPercentage?: number;


    @IsOptional()
    @Transform(({ value }) =>
        value === '' || value === null || value === undefined
            ? undefined
            : Number(value)
    )
    @IsNumber({}, { message: 'Maximum commission amount must be a number' })
    maxCommissionAmount?: number;

    // @CreateDateColumn()
    // createdAt: Date;

    // @UpdateDateColumn()
    // updatedAt: Date;
}