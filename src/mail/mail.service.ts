import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    //   async sendTestEmail() {
    //     await this.mailerService.sendMail({
    //       to: 'muskandhiman5678@gmail.com',
    //       subject: 'My First NestJS Email',
    //       text: 'Hello! This is my first email sent from NestJS.',
    //     });

    //     return {
    //       message: 'Email sent successfully!',
    //     };
    //   }
    async sendTestEmail(email: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'My First NestJS Email',
            text: 'Hello! This is my first email sent from NestJS.',
        });

        return {
            message: 'Email sent successfully!',
        };
    }
}
