import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MaintenanceGuard } from './maintenance.guard';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  private jwtAuthGuard: JwtAuthGuard;
  private maintenanceGuard: MaintenanceGuard;

  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    this.jwtAuthGuard = new JwtAuthGuard();
    this.maintenanceGuard = new MaintenanceGuard(configService);
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // FIRST PRIORITY: Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is marked as public, skip all other checks
    if (isPublic) {
      return true;
    }

    // SECOND PRIORITY: Authenticate user with JWT
    // This populates request.user with user information
    const isAuthenticated = await this.jwtAuthGuard.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // THIRD PRIORITY: Check maintenance mode (after we have user info)
    // Admin users bypass maintenance mode
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Skip maintenance check for admin users
    if (user && user.role !== UserRole.ADMIN) {
      this.maintenanceGuard.canActivate(context);
    }

    return true;
  }
}
