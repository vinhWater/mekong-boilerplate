import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles are allowed to access a route
 * @param roles Array of roles that can access the route
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
