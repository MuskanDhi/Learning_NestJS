import {
    IsNotEmpty,
    IsEmail,
} from 'class-validator';

export class CreateTeamMemberDto {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    phoneNumber: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    joiningDate: string;

    @IsNotEmpty()
    aboutMember: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    serviceIds: string[];

    workingSchedule: {
        day: string;
        isOff: boolean;
        slots?: {
            startTime: string;
            endTime: string;
        }[];
    }[];
}
