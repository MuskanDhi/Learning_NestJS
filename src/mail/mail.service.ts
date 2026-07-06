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


    // async sendTestEmail(email: string) {
    //     await this.mailerService.sendMail({
    //         to: email,
    //         subject: 'My First NestJS Email',
    //         text: 'Hello! This is my first email sent from NestJS.',
    //     });

    //     return {
    //         message: 'Email sent successfully!',
    //     };
    // }

    async sendOtp(email: string, otp: string) {
        await this.mailerService.sendMail({
            to: email,

            subject: 'Verify your Email',

            html: `
      <h2>Email Verification</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP expires in 10 minutes.</p>
    `,
        });
    }

    async sendTestEmail(email: string) {
        return this.mailerService.sendMail({
            to: email,
            subject: 'Test Email',
            html: '<h1>Email is working!</h1>',
        });
    }
}
