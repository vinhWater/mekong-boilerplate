import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { UserRole } from './enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { OAuthAccount } from './entities/oauth-account.entity';
import { MagicLinkToken } from './entities/magic-link-token.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { RefreshToken } from './entities/refresh-token.entity';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { TokenResponseDto } from './dto/token-response.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(OAuthAccount)
    private oauthAccountsRepository: Repository<OAuthAccount>,
    @InjectRepository(MagicLinkToken)
    private magicLinkTokensRepository: Repository<MagicLinkToken>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {
    // Set to 4 hours for access token to test refresh functionality, 7 days for refresh token
    this.accessTokenExpiresIn = 4 * 60 * 60; // 4 hours in seconds
    this.refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
    
    // Initialize Google OAuth2 client for ID token verification
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  /**
   * Normalize email address to lowercase and trim whitespace
   */
  private normalizeEmail(email: string): string {
    return email?.toLowerCase().trim();
  }

  /**
   * OAuth login with Google ID token verification
   * This method verifies the ID token with Google before creating/updating the user
   * @param provider - OAuth provider (currently only 'google' is supported)
   * @param idToken - Google ID token received from the frontend
   * @returns TokenResponseDto with access token, refresh token, and user data
   */
  async oauthLogin(
    provider: string,
    idToken: string,
  ): Promise<TokenResponseDto> {
    // Currently only Google OAuth is supported
    if (provider !== 'google') {
      throw new BadRequestException('Only Google OAuth is currently supported');
    }

    try {
      // ✅ Verify the ID token with Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        this.logger.warn('Google token verification failed: Invalid token payload');
        throw new UnauthorizedException('Google token verification failed: Invalid token payload');
      }

      // Extract verified user data from the token
      const { sub: providerId, email, name, picture } = payload;

      // Log successful verification
      this.logger.log(`Google token verified successfully for email: ${email}`);

      // Normalize email to prevent case sensitivity issues
      const normalizedEmail = this.normalizeEmail(email);

      // Find or create user
      let user = await this.usersRepository.findOne({ 
        where: { email: normalizedEmail } 
      });

      if (!user) {
        user = this.usersRepository.create({
          email: normalizedEmail,
          name,
          image: picture,
          role: UserRole.MEMBER,
        });
        await this.usersRepository.save(user);
        this.logger.log(`New user created via Google OAuth: ${normalizedEmail}`);
      } else {
        // Update user info if changed
        let updated = false;
        if (name && user.name !== name) {
          user.name = name;
          updated = true;
        }
        if (picture && user.image !== picture) {
          user.image = picture;
          updated = true;
        }
        if (updated) {
          await this.usersRepository.save(user);
          this.logger.log(`User profile updated via Google OAuth: ${normalizedEmail}`);
        }
      }

      // Find or create OAuth account
      let oauthAccount = await this.oauthAccountsRepository.findOne({
        where: { provider, providerId },
      });

      if (!oauthAccount) {
        oauthAccount = this.oauthAccountsRepository.create({
          user,
          provider,
          providerId,
        });
        await this.oauthAccountsRepository.save(oauthAccount);
      }

      // Generate JWT tokens
      return this.generateTokens(user);
    } catch (error) {
      // Handle specific Google verification errors
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Log and handle Google API errors
      this.logger.error(`Google token verification failed: ${error.message}`, {
        provider,
        timestamp: new Date().toISOString(),
        error: error.message,
      });

      throw new UnauthorizedException(
        `Google token verification failed: ${error.message}`,
      );
    }
  }

  /**
   * Generate access and refresh tokens for a user
   */
  private async generateTokens(user: User): Promise<TokenResponseDto> {
    // Generate JWT access token
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role, // Include role in JWT payload
      },
      {
        expiresIn: this.accessTokenExpiresIn,
      },
    );

    // Generate refresh token
    const refreshToken = uuidv4();

    // Calculate expiry date for refresh token
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + this.refreshTokenExpiresIn);

    // Save refresh token to database
    await this.refreshTokensRepository.save({
      token: refreshToken,
      userId: user.id,
      user,
      revoked: false,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiresIn,
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // Include role in response
      },
    };
  }

  async sendMagicLink(email: string, redirectUrl: string, metadata?: any) {
    // Normalize email to prevent case sensitivity issues
    const normalizedEmail = this.normalizeEmail(email);

    // Find or create user
    let user = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = this.usersRepository.create({ email: normalizedEmail, role: UserRole.MEMBER });
      await this.usersRepository.save(user);
    }

    // Generate token
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Save token with metadata
    await this.magicLinkTokensRepository.save({
      email: normalizedEmail,
      token,
      expiresAt,
      metadata, // Save metadata
    });

    // Construct magic link URL
    // Check if redirectUrl already has query parameters to use correct separator
    const separator = redirectUrl.includes('?') ? '&' : '?';
    const magicLinkUrl = `${redirectUrl}${separator}email=${encodeURIComponent(email)}&token=${token}`;

    // Send magic link email
    await this.mailService.sendMagicLink(email, magicLinkUrl);
  }

  async verifyMagicLink(
    email: string,
    token: string,
  ): Promise<TokenResponseDto> {
    // Normalize email to prevent case sensitivity issues
    const normalizedEmail = this.normalizeEmail(email);

    // Find token
    const magicLinkToken = await this.magicLinkTokensRepository.findOne({
      where: { email: normalizedEmail, token },
    });

    if (!magicLinkToken) {
      throw new UnauthorizedException('Invalid token');
    }

    // Check if token is expired
    if (new Date() > magicLinkToken.expiresAt) {
      throw new UnauthorizedException('Token expired');
    }

    // Store metadata before deleting token
    const metadata = magicLinkToken.metadata;

    // Find or create user
    let user = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      user = this.usersRepository.create({ email: normalizedEmail, role: UserRole.MEMBER });
      await this.usersRepository.save(user);
    }

    // Delete token
    await this.magicLinkTokensRepository.remove(magicLinkToken);

    // Generate tokens and include metadata
    const tokenResponse = await this.generateTokens(user);
    return {
      ...tokenResponse,
      metadata, // Include metadata in response
    };
  }

  /**
   * Refresh access token using a valid refresh token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    this.logger.log(`Refreshing token: ${refreshToken}`);
    try {
      // Find the refresh token in the database
      const refreshTokenEntity = await this.refreshTokensRepository.findOne({
        where: { token: refreshToken },
        relations: ['user'],
      });

      // Check if token exists and is valid
      if (!refreshTokenEntity) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if token is expired
      const now = new Date();
      if (now > refreshTokenEntity.expiresAt) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Check if token is revoked
      if (refreshTokenEntity.revoked) {
        throw new UnauthorizedException('Refresh token revoked');
      }

      // Get the user
      const user = refreshTokenEntity.user;
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Revoke the current refresh token after a short delay (5 seconds)
      // This helps prevent issues if multiple requests are made with the same token in quick succession
      setTimeout(async () => {
        try {
          await this.refreshTokensRepository.update(refreshTokenEntity.id, {
            revoked: true,
          });
        } catch (error) {
          this.logger.error(`Error revoking refresh token: ${error.message}`);
        }
      }, 5000);

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      return tokens;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Revoke a refresh token (used for logout)
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const result = await this.refreshTokensRepository.update(
      { token: refreshToken },
      { revoked: true },
    );

    if (result.affected === 0) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  /**
   * Revoke all refresh tokens for a user (used for logout from all devices)
   */
  async revokeAllUserRefreshTokens(userId: number): Promise<void> {
    await this.refreshTokensRepository.update({ userId }, { revoked: true });
  }

  /**
   * Find all users (without pagination)
   */
  async findAllUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Find all users with pagination and filtering
   */
  async findAllUsersPaginated(
    paginationQuery: PaginationQueryDto,
    filterDto: {
      search?: string;
      email?: string;
      name?: string;
      role?: UserRole;
      createdDateFrom?: string;
      createdDateTo?: string;
    },
  ): Promise<{
    data: User[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  }> {
    // Set default values for pagination
    const limit = paginationQuery.limit ?? 20;
    const page = paginationQuery.page ?? 1;
    const sortField = paginationQuery.sortField ?? 'createdAt';
    const sortDirection = paginationQuery.sortDirection ?? 'desc';
    const { search, email, name, role, createdDateFrom, createdDateTo } = filterDto;

    // Calculate the skip value based on page and limit
    const skip = (page - 1) * limit;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Apply filters if provided
    if (search) {
      queryBuilder.where(
        '(LOWER(user.email) LIKE LOWER(:search) OR LOWER(user.name) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (email) {
      queryBuilder.andWhere('LOWER(user.email) LIKE LOWER(:email)', { email: `%${email}%` });
    }

    if (name) {
      queryBuilder.andWhere('LOWER(user.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (createdDateFrom) {
      queryBuilder.andWhere('user.createdAt >= :createdDateFrom', { createdDateFrom });
    }

    if (createdDateTo) {
      queryBuilder.andWhere('user.createdAt <= :createdDateTo', { createdDateTo });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    // Apply sorting
    const allowedSortFields = ['id', 'name', 'email', 'role', 'balance', 'createdAt', 'updatedAt'];
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'createdAt';
    const validSortDirection = ['asc', 'desc'].includes(sortDirection.toLowerCase()) ? sortDirection.toLowerCase() : 'desc';

    queryBuilder.orderBy(`user.${validSortField}`, validSortDirection.toUpperCase() as 'ASC' | 'DESC');

    // Execute query
    const data = await queryBuilder.getMany();

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  /**
   * Find user by id
   */
  async findUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  /**
   * Update user role
   */
  async updateUserRole(id: number, role: UserRole): Promise<User> {
    const user = await this.findUserById(id);
    user.role = role;
    return this.usersRepository.save(user);
  }

  /**
   * Get current user information (for session refresh)
   * Returns user with role and managerId for NextAuth session update
   */
  async getMe(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
