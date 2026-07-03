import { Module } from '@nestjs/common';
import { AlarmController } from './alarm.controller';
import { AlarmService } from './alarm.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from 'src/firebase-web-notification/notification.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationsModule,
  ],
  controllers: [AlarmController],
  providers: [AlarmService]
})
export class AlarmModule {}
