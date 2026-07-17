import {
    IsEmail,
    IsNotEmpty
} from 'class-validator';

export class SignupDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsEmail({}, {
        message: "Please enter a valid email address",
    })
    email: string;
}