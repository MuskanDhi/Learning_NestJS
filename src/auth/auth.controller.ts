import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) { }

  @Post('login')
  login(
    @Body() body: any,
  ) {
    console.log('LOGIN API HIT');
    return this.authService.login(body);
  }

  @Post('register/:branchId')
  register(
    @Param('branchId') branchId: string,
    @Body() body: any,
  ) {
    return this.authService.register(
      branchId,
      body);
  }

  @Post('verify-otp')
  verifyOtp(@Body() body: any) {
    return this.authService.verifyOtp(body);
  }

  @Patch('update/:userId')
  signup(
    @Param('userId') userId: string,
    @Body() body: any,
  ) {
    return this.authService.signup(
      userId,
      body,
    );
  }

}

// @Post('phone')
// phoneAuth(@Body() body: any) {
//   return this.authService.phoneAuth(body);
// }
