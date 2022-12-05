import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsNumberString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(7)
  password: string;

  @IsNotEmpty()
  @Length(7)
  confirmPassword: string;
}
