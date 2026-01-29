import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { OAuthAccount } from './entities/oauth-account.entity';
import { MagicLinkToken } from './entities/magic-link-token.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserRole } from './enums/user-role.enum';

// Mock data
const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  image: 'test-image.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
  oauthAccounts: [],
  refreshTokens: [],
  role: UserRole.MANAGER,
};

const mockRefreshToken = {
  id: 1,
  token: 'refresh-token-123',
  userId: 1,
  user: mockUser,
  isRevoked: false,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  createdAt: new Date(),
};

const mockExpiredRefreshToken = {
  id: 2,
  token: 'expired-token-123',
  userId: 1,
  user: mockUser,
  isRevoked: false,
  expiresAt: new Date(Date.now() - 1000), // Expired
  createdAt: new Date(),
};

const mockRevokedRefreshToken = {
  id: 3,
  token: 'revoked-token-123',
  userId: 1,
  user: mockUser,
  isRevoked: true,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  createdAt: new Date(),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let refreshTokenRepository: Repository<RefreshToken>;
  let oauthAccountRepository: Repository<OAuthAccount>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(OAuthAccount),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MagicLinkToken),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendMagicLink: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('jwt-secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    refreshTokenRepository = module.get<Repository<RefreshToken>>(
      getRepositoryToken(RefreshToken),
    );
    oauthAccountRepository = module.get<Repository<OAuthAccount>>(
      getRepositoryToken(OAuthAccount),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: Update oauthLogin tests to mock Google ID token verification
  // These tests need to mock google-auth-library's OAuth2Client.verifyIdToken()
  // See: https://github.com/googleapis/google-auth-library-nodejs
  describe('oauthLogin', () => {
    it.skip('should verify Google ID token and create new user', async () => {
      // TODO: Mock OAuth2Client.verifyIdToken() to return valid payload
      // TODO: Test that invalid tokens are rejected
      // TODO: Test that user profile is updated if it changed
    });

    it.skip('should reject invalid Google ID tokens', async () => {
      // TODO: Mock OAuth2Client.verifyIdToken() to throw error
      // TODO: Assert UnauthorizedException is thrown
    });
  });

  describe('refreshToken', () => {
    it('should refresh a valid token', async () => {
      // Mock finding a valid refresh token
      jest
        .spyOn(refreshTokenRepository, 'findOne')
        .mockResolvedValue(mockRefreshToken as RefreshToken);
      // Mock revoking the old token
      jest
        .spyOn(refreshTokenRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);
      // Mock creating a new refresh token
      jest.spyOn(refreshTokenRepository, 'save').mockResolvedValue({
        ...mockRefreshToken,
        id: 4,
        token: 'new-refresh-token-123',
      } as RefreshToken);

      // Mock the service's setTimeout call
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      setTimeoutSpy.mockImplementation((callback: any) => {
        callback();
        return 1 as any;
      });

      const result = await service.refreshToken('refresh-token-123');

      expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: 'refresh-token-123' },
        relations: ['user'],
      });

      // The update is now called inside setTimeout
      expect(refreshTokenRepository.update).toHaveBeenCalledWith(
        mockRefreshToken.id,
        { isRevoked: true },
      );

      expect(jwtService.sign).toHaveBeenCalled();
      expect(refreshTokenRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('expiresIn');
      expect(result).toHaveProperty('user');

      // Restore setTimeout
      setTimeoutSpy.mockRestore();
    });

    it('should throw an error for an invalid refresh token', async () => {
      // Mock refresh token not found
      jest.spyOn(refreshTokenRepository, 'findOne').mockResolvedValue(null);

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: 'invalid-token' },
        relations: ['user'],
      });
    });

    it('should throw an error for an expired refresh token', async () => {
      // Mock finding an expired refresh token
      jest
        .spyOn(refreshTokenRepository, 'findOne')
        .mockResolvedValue(mockExpiredRefreshToken as RefreshToken);

      await expect(service.refreshToken('expired-token-123')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: 'expired-token-123' },
        relations: ['user'],
      });
    });

    it('should throw an error for a revoked refresh token', async () => {
      // Mock finding a revoked refresh token
      jest
        .spyOn(refreshTokenRepository, 'findOne')
        .mockResolvedValue(mockRevokedRefreshToken as RefreshToken);

      await expect(service.refreshToken('revoked-token-123')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(refreshTokenRepository.findOne).toHaveBeenCalledWith({
        where: { token: 'revoked-token-123' },
        relations: ['user'],
      });
    });
  });

  describe('revokeRefreshToken', () => {
    it('should revoke a valid refresh token', async () => {
      // Mock successful update
      jest
        .spyOn(refreshTokenRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      await service.revokeRefreshToken('refresh-token-123');

      expect(refreshTokenRepository.update).toHaveBeenCalledWith(
        { token: 'refresh-token-123' },
        { isRevoked: true },
      );
    });

    it('should throw an error if the token does not exist', async () => {
      // Mock unsuccessful update
      jest
        .spyOn(refreshTokenRepository, 'update')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.revokeRefreshToken('invalid-token')).rejects.toThrow(
        BadRequestException,
      );
      expect(refreshTokenRepository.update).toHaveBeenCalledWith(
        { token: 'invalid-token' },
        { isRevoked: true },
      );
    });
  });

  describe('revokeAllUserRefreshTokens', () => {
    it('should revoke all refresh tokens for a user', async () => {
      // Mock successful update
      jest
        .spyOn(refreshTokenRepository, 'update')
        .mockResolvedValue({ affected: 3 } as any);

      await service.revokeAllUserRefreshTokens(1);

      expect(refreshTokenRepository.update).toHaveBeenCalledWith(
        { userId: 1 },
        { isRevoked: true },
      );
    });
  });
});
