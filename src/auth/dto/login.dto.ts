import {
    IsNotEmpty,
    Matches
} from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    @Matches(/^[6-9]\d{9}$/, {
        message: 'Invalid phone number',
    })
    phoneNumber: string;
}