import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthsService } from './auths.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auths')
export class AuthsController {
    constructor(
        private readonly authsService: AuthsService,
    ) { }

    @Post('signup')
    signup(@Body() signupDto: SignupDto) {
        return this.authsService.signup(signupDto);
    }

    @Post('verify-otp')
    verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authsService.verifyOtp(verifyOtpDto);
    }

    @Post("login")
    login(@Body() loginDto: LoginDto) {
        return this.authsService.login(loginDto);
    }
}
