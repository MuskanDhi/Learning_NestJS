import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePurchasedPackageServiceDto {

  @IsNotEmpty()
  purchasedPackageId: string;

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
  startTime: string;
}