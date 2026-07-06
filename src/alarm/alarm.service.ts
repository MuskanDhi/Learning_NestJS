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
            "dUQVeHkrGrde8AHvcqNF6p:APA91bGTDvwrTFzbLEYSrAzX_aRCGbv7B3VTa_5Yt3AdnxwnG5PNe3JxeFMNi7PlyW_xUuyQmO-nUhxiXM_wxWra4neGeynhuHvH19qZghdqOAtXCznJTpA";

        await this.notificationService.send(

            token,

            "Alarm",

            `Current Time : ${now.toLocaleTimeString()}`,

        );

        console.log("Alarm Notification Sent");

    }
}
