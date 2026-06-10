import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Branch } from 'src/branches/entities/branch.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Appointment } from './entities/appointment.entity';
import { Service } from 'src/services/entities/services.entity';
import { TeamMember } from 'src/team-members/entities/team-member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Customer, Appointment, Service, TeamMember]),
    AuthModule,
  ],
  providers: [AppointmentsService],
  controllers: [AppointmentsController]
})
export class AppointmentsModule { }
