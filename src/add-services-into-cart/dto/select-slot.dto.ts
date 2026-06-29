// select-slot.dto.ts

import { IsString } from 'class-validator';

export class SelectSlotDto {
    @IsString()
    teamMemberId: string;

    @IsString()
    appointmentDate: string;

    @IsString()
    startTime: string;
}