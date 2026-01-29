import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Maintenance Mode Guard
 * 
 * This guard checks if the system is in maintenance mode by reading
 * the MAINTENANCE_MODE environment variable. When maintenance mode is
 * active, all requests are blocked with a 503 Service Unavailable error.
 * 
 * Usage:
 * - Set MAINTENANCE_MODE=true in .env to enable maintenance mode
 * - Restart the backend to apply the change
 * - All API endpoints will be blocked until MAINTENANCE_MODE=false
 */
@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    // Read maintenance mode flag from environment
    const isMaintenanceMode = this.configService.get<string>('MAINTENANCE_MODE') === 'true';

    if (isMaintenanceMode) {
      // Block all requests during maintenance
      throw new ServiceUnavailableException(
        'System is under maintenance. Please try again later.'
      );
    }

    // Allow request to proceed
    return true;
  }
}
