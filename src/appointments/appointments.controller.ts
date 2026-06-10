import {
    Body,
    Controller,
    Param,
    Post,
} from '@nestjs/common';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {

    constructor(
        private readonly appointmentsService: AppointmentsService,
    ) {}

    @Post(':branchId')
    create(
        @Param('branchId') branchId: string,
        @Body() dto: CreateAppointmentDto,
    ) {
        return this.appointmentsService.create(
            branchId,
            dto,
        );
    }
}