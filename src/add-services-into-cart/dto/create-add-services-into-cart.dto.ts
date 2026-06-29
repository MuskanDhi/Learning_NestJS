import {
  IsString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class CreateAddServicesIntoCartDto {

  @IsString()
  serviceId: string;

  @IsNotEmpty()
  @IsEnum(['service', 'package', 'deal'])
  type?: 'service' | 'package' | 'deal';

  @IsNotEmpty()
  @IsString()
  referenceId?: string;

  customerId: string;
}