import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendMailDto } from './dto/send-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  // @Get('send')
  // sendEmail() {
  //   return this.mailService.sendTestEmail();
  // }
  @Post('send')
  sendEmail(@Body() body: SendMailDto) {
    return this.mailService.sendTestEmail(body.email);
  }
}
