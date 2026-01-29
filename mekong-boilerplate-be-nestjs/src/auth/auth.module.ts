import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UserController } from './controllers/user.controller';
import { CustomJwtGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { OAuthAccount } from './entities/oauth-account.entity';
import { MagicLinkToken } from './entities/magic-link-token.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { MailModule } from '../mail/mail.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      OAuthAccount,
      MagicLinkToken,
      RefreshToken,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          // Default expiration is 15 minutes, but we'll handle refresh tokens
          expiresIn: '15m',
        },
      }),
    }),
    MailModule,
  ],
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    JwtStrategy,
    CustomJwtGuard,
    RoleGuard,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule,
    CustomJwtGuard,
    RoleGuard,
    JwtModule,
  ],
})
export class AuthModule { }

