import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ValidateOtpDto } from '../dtos/validateOtp.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  //   register new user
  @Post('register')
  async register(@Body() payload: CreateUserDto): Promise<object> {
    return await this.authService.register(payload);
  }

  // user login
  @Post('login')
  async login(@Body() payload: LoginDto) {
    return await this.authService.login(payload.email, payload.password);
  }

  // reset password - step one
  // @Post('password-reset')
  // async resetPassword(@Body('email') email: string) {
  //   if (!email) {
  //     throw new BadRequestException('email must not by empty');
  //   }
  //   return await this.otpService.resetPassword(email);
  // }

  // // verify reset password otp
  // @Post('password-reset/verify')
  // async validateOtpForResetPassword(
  //   @Body() validateOtpPayload: ValidateOtpDto,
  // ) {
  //   const { email, otp } = validateOtpPayload;
  //   return await this.otpService.validateOtpForResetPassword(otp, email);
  // }

  // /**
  //  * This is the controller handling the change of reset password
  //  */
  // @Patch('password-reset/update')
  // async changePassword(@Body() resetPasswordPayload: ResetPasswordDto) {
  //   return await this.authService.changePassword(resetPasswordPayload);
  // }
}
