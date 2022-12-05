import { IsEmail, IsNotEmpty, IsNumberString } from "class-validator";

export class ValidateOtpDto {
    @IsNotEmpty()
    @IsNumberString()
    otp: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}