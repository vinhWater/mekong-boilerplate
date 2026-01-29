import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { RequestMagicLinkDto } from './dto/request-magic-link.dto';
import { VerifyMagicLinkDto } from './dto/verify-magic-link.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserRole } from './enums/user-role.enum';

// Mock AuthService
const mockAuthService = {
  oauthLogin: jest.fn(),
  sendMagicLink: jest.fn(),
  verifyMagicLink: jest.fn(),
  refreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
  revokeAllUserRefreshTokens: jest.fn(),
};

// Mock data
const mockTokenResponse: TokenResponseDto = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 900, // 15 minutes
  tokenType: 'Bearer',
  user: {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.MANAGER,
  },
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    // Reset mocks
    mockAuthService.oauthLogin.mockResolvedValue(mockTokenResponse);
    mockAuthService.sendMagicLink.mockResolvedValue(undefined);
    mockAuthService.verifyMagicLink.mockResolvedValue(mockTokenResponse);
    mockAuthService.refreshToken.mockResolvedValue(mockTokenResponse);
    mockAuthService.revokeRefreshToken.mockResolvedValue(undefined);
    mockAuthService.revokeAllUserRefreshTokens.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('oauthLogin', () => {
    it('should call authService.oauthLogin with correct parameters', async () => {
      const oauthLoginDto: OAuthLoginDto = {
        provider: 'google',
        idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjAyN...', // Mock Google ID token
      };

      const result = await controller.oauthLogin(oauthLoginDto);

      expect(authService.oauthLogin).toHaveBeenCalledWith(
        oauthLoginDto.provider,
        oauthLoginDto.idToken,
      );
      expect(result).toEqual(mockTokenResponse);
    });
  });

  describe('requestMagicLink', () => {
    it('should call authService.sendMagicLink with correct parameters', async () => {
      const requestMagicLinkDto: RequestMagicLinkDto = {
        email: 'test@example.com',
        redirectUrl: 'https://example.com/verify',
      };

      const result = await controller.requestMagicLink(requestMagicLinkDto);

      expect(authService.sendMagicLink).toHaveBeenCalledWith(
        requestMagicLinkDto.email,
        requestMagicLinkDto.redirectUrl,
      );
      expect(result).toEqual({
        success: true,
        message: 'Sign-in link sent to your email',
      });
    });
  });

  describe('verifyMagicLink', () => {
    it('should call authService.verifyMagicLink with correct parameters', async () => {
      const verifyMagicLinkDto: VerifyMagicLinkDto = {
        email: 'test@example.com',
        token: 'magic-token-123',
      };

      const result = await controller.verifyMagicLink(verifyMagicLinkDto);

      expect(authService.verifyMagicLink).toHaveBeenCalledWith(
        verifyMagicLinkDto.email,
        verifyMagicLinkDto.token,
      );
      expect(result).toEqual(mockTokenResponse);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken with correct parameters', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'refresh-token-123',
      };

      const result = await controller.refreshToken(refreshTokenDto);

      expect(authService.refreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(result).toEqual(mockTokenResponse);
    });
  });

  describe('logout', () => {
    it('should call authService.revokeRefreshToken with correct parameters', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'refresh-token-123',
      };

      const result = await controller.logout(refreshTokenDto);

      expect(authService.revokeRefreshToken).toHaveBeenCalledWith(
        refreshTokenDto.refreshToken,
      );
      expect(result).toEqual({
        success: true,
        message: 'Signed out successfully',
      });
    });
  });

  describe('logoutAll', () => {
    it('should call authService.revokeAllUserRefreshTokens with correct parameters', async () => {
      const req = { user: { id: 1, role: UserRole.MANAGER } };

      const result = await controller.logoutAll(req);

      expect(authService.revokeAllUserRefreshTokens).toHaveBeenCalledWith(
        req.user.id,
      );
      expect(result).toEqual({
        success: true,
        message: 'Signed out from all devices successfully',
      });
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request', () => {
      const req = {
        user: { id: 1, email: 'test@example.com', role: UserRole.MANAGER },
      };

      const result = controller.getProfile(req);

      expect(result).toEqual(req.user);
    });
  });
});
