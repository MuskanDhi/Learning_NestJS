import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationService } from 'src/firebase-web-notification/notification.service';

@Injectable()
export class AlarmService {
    constructor(

        private readonly notificationService: NotificationService,

    ) { }

    @Cron('* * * * *', {
        timeZone: 'Asia/Kolkata',
    }) // every minute
    // async handleCron() {
    //     console.log('Checking alarms...');

    //     const now = new Date();

    //     console.log('Checking alarms at:', now);
    // }
    async handleCron() {

        console.log("Checking alarms...");

        const now = new Date();

        console.log(now);

        const token =
            "YOUR_FCM_TOKEN";

        await this.notificationService.send(

            token,

            "Alarm",

            `Current Time : ${now.toLocaleTimeString()}`,

        );

        console.log("Alarm Notification Sent");

    }
}
