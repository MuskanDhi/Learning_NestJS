import {
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

export class CreateAddServicesIntoCartDto {

  @IsString()
  serviceId: string;

  @IsOptional()
  @IsEnum(['package', 'deal'])
  type?: 'package' | 'deal';

  @IsOptional()
  @IsString()
  referenceId?: string;
}