import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { RequestMagicLinkDto } from './dto/request-magic-link.dto';
import { VerifyMagicLinkDto } from './dto/verify-magic-link.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { TokenResponseDto } from './dto/token-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('oauth-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'OAuth login with Google',
    description: 'Authenticates user with Google ID token. The token is verified with Google before creating/updating the user.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT tokens',
    type: TokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or expired Google ID token',
  })
  async oauthLogin(
    @Body() oauthLoginDto: OAuthLoginDto,
  ): Promise<TokenResponseDto> {
    return this.authService.oauthLogin(
      oauthLoginDto.provider,
      oauthLoginDto.idToken,
    );
  }

  @Public()
  @Post('request-magic-link')
  @HttpCode(HttpStatus.OK)
  async requestMagicLink(@Body() requestMagicLinkDto: RequestMagicLinkDto) {
    await this.authService.sendMagicLink(
      requestMagicLinkDto.email,
      requestMagicLinkDto.redirectUrl,
    );
    return { success: true, message: 'Sign-in link sent to your email' };
  }

  @Public()
  @Post('verify-magic-link')
  @HttpCode(HttpStatus.OK)
  async verifyMagicLink(
    @Body() verifyMagicLinkDto: VerifyMagicLinkDto,
  ): Promise<TokenResponseDto> {
    return this.authService.verifyMagicLink(
      verifyMagicLinkDto.email,
      verifyMagicLinkDto.token,
    );
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.authService.revokeRefreshToken(refreshTokenDto.refreshToken);
    return { success: true, message: 'Signed out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@Request() req) {
    await this.authService.revokeAllUserRefreshTokens(req.user.id);
    return {
      success: true,
      message: 'Signed out from all devices successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user information',
    description: 'Returns fresh user data including role and managerId. Used for NextAuth session refresh after user data changes (e.g., accepting team invitation).'
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getMe(@Request() req) {
    return this.authService.getMe(req.user.id);
  }
}
