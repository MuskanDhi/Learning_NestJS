// import {
//     IsNotEmpty,
//     IsEmail,
//     IsOptional,
// } from 'class-validator';

import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

// export class CreateTeamMemberDto {

//     @IsNotEmpty()
//     firstName: string;

//     @IsNotEmpty()
//     lastName: string;

//     @IsNotEmpty()
//     phoneNumber: string;

//     @IsEmail()
//     email: string;

//     @IsNotEmpty()
//     address: string;

//     @IsNotEmpty()
//     joiningDate: string;

//     @IsNotEmpty()
//     aboutMember: string;

//     @IsNotEmpty()
//     gender: string;

//     @IsNotEmpty()
//     roleId: string;

//     @IsNotEmpty()
//     serviceIds: string[];

//     @IsNotEmpty()
//     experience: string;

//     @IsNotEmpty()
//     specialtyIds: number[];

//     @IsOptional()
//     profileImage: string;

//     workingSchedule: {
//         day: string;
//         isOff: boolean;
//         slots?: {
//             startTime: string;
//             endTime: string;
//         }[];
//     }[];
// }


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

    @IsOptional()
    experience: string;

    @IsOptional()
    profileImage: string;

    @IsNotEmpty()
    aboutMember: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    roleId: string;

    @IsNotEmpty()
    serviceIds: string[];

    @IsOptional()
    specialtyIds: number[];

    workingSchedule: {
        day: string;
        isOff: boolean;
        slots?: {
            startTime: string;
            endTime: string;
        }[];
    }[];
}
