import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OAuthLoginDto {
  @ApiProperty({
    description: 'OAuth provider name (currently only "google" is supported)',
    example: 'google',
  })
  @IsNotEmpty()
  @IsString()
  provider: string;

  @ApiProperty({
    description: 'Google ID token received from OAuth flow',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjAyN...',
  })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}
