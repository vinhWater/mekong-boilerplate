import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestMagicLinkDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  redirectUrl: string;
}
