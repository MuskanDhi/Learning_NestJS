import { Module } from '@nestjs/common';
import { AuthsController } from './auths.controller';
import { AuthsService } from './auths.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../email-users/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
  ],
  controllers: [AuthsController],
  providers: [AuthsService]
})
export class AuthsModule {}
