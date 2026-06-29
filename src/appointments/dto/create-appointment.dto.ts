import { IsNotEmpty, IsString } from "class-validator";

export class CreateAppointmentDto {

    @IsNotEmpty()
    customerId: string;

    @IsNotEmpty()
    serviceId: string;

    @IsNotEmpty()
    teamMemberId: string;

    @IsString()
    appointmentDate: string;

    @IsNotEmpty()
    appointmentStartTime: string;
}