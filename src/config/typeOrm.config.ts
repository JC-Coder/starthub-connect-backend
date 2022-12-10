import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UserEntity } from './../modules/v1/users/entities/users.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User1670408836840 } from './../migrations/1670408836840-User';
import { experienceYearCount1670668096450 } from './../migrations/1670668096450-experience_year_count';

config();

/**
 * Config for nestjs db connection
 */

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  /* Note : it is unsafe to use synchronize: true for schema synchronization
    on production once you get data in your database. */
  // synchronize: true,
  autoLoadEntities: true,
};

/**
 * Config for migrations
 */

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  // url: process.env.DATABASE_URL,
  entities: [UserEntity],
  migrations: [User1670408836840,experienceYearCount1670668096450],
});
