import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyMagicLinkDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
