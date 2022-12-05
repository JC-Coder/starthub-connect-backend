import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeOrm.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { config } from 'dotenv';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from './modules/v1/auth/auth.module';
import { UserController } from './modules/v1/users/controllers/user.controller';
import { UserModule } from './modules/v1/users/user.module';
import { MailModule } from './modules/v1/mail/mail.module';
import { typeOrmStagingConfig } from './config/typeOrm-staging.config';

config();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: '',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      template: {
        dir: 'src/templates/mails',
        adapter: new HandlebarsAdapter(),
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig, // change to typeormConfig when working offline with mysql
    }),
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    UserModule,
    MailModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
