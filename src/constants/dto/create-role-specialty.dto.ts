import {
    IsIn,
    IsNotEmpty,
} from 'class-validator';

export class CreateConstantDto {

    @IsIn(['role', 'specialty'])
    type: string;

    @IsNotEmpty()
    name: string;
}