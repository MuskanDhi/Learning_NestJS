import {
    IsEmail,
    IsNotEmpty
} from 'class-validator';

export class SignupDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;
}