import { IsNotEmpty } from "class-validator";

export class CreateAppointmentDto {

    @IsNotEmpty()
    customerId: string;

    @IsNotEmpty()
    serviceId: string;

    @IsNotEmpty()
    teamMemberId: string;

    @IsNotEmpty()
    appointmentStartTime: string;
}