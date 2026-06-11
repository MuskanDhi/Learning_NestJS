import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AlarmService {

    @Cron('* * * * *', {
        timeZone: 'Asia/Kolkata',
    }) // every minute
    async handleCron() {
        console.log('Checking alarms...');

        const now = new Date();

        console.log('Checking alarms at:', now);
    }
}
