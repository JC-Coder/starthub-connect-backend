import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { config } from 'dotenv';

config();

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpMail(email: string, otp: number) {
    return await this.mailerService.sendMail({
      to: email,
      from: process.env.SMTP_USER,
      subject: 'OTP',
      template: 'otp',
      context: {
        otp,
      },
    });
  }
}