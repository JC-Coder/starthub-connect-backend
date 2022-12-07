import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import { UserEntity } from './modules/v1/users/entities/users.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /**
   * seeding db
   */
  // (async () => {
  //   const options: DataSourceOptions & SeederOptions = {
  //     type: 'postgres',
  //     host: configService.get('DB_HOST'),
  //     port: configService.get('DB_PORT'),
  //     username: configService.get('DB_USERNAME'),
  //     password: configService.get('DB_PASSWORD'),
  //     database: configService.get('DB_NAME'),
  //     entities: [UserEntity],

  //     seeds: ['src/database/seeds/**/*{.ts,.js}'],
  //     factories: ['src/database/factories/**/*{.ts,.js}']
  //   };

  //   const dataSource = new DataSource(options);
  //   await dataSource.initialize();

  //   await runSeeders(dataSource);
  // })();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
