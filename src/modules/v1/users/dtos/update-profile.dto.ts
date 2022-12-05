import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from 'src/enums/gender.enum';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone_number: string;

  @IsOptional()
  @IsEnum({
    enum: GenderEnum,
  })
  gender: GenderEnum;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  success_story: string;

  @IsString()
  @IsOptional()
  skills: string;

  @IsString()
  @IsOptional()
  facebook_url: string;

  @IsString()
  @IsOptional()
  twitter_url: string;

  @IsString()
  @IsOptional()
  instagram_url: string;

  @IsString()
  @IsOptional()
  linkdln_url: string;

  @IsString()
  @IsOptional()
  website_url: string;
}
