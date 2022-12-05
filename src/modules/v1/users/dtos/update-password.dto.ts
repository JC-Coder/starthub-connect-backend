import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(7)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(7)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(7)
  confirmPassword: string;
}
