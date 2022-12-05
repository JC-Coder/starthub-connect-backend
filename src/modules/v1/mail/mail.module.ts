import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { MailService } from './mail.service';

@Module({
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
