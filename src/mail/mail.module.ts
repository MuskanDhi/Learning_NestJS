import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
  imports: [MailModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
