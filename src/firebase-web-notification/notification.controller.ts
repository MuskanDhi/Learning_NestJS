import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {

  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Post('send')
  async send(@Body() body: any) {

    return this.notificationService.send(

      body.token,

      body.title,

      body.body,

    );

  }

}