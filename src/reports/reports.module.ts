import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Branch } from 'src/branches/entities/branch.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Module({
          imports: [
            TypeOrmModule.forFeature([
              Branch,
              Appointment
            ]),
            AuthModule
        ],
  providers: [ReportsService],
  controllers: [ReportsController]
})
export class ReportsModule {}
