import { UserRole } from '../enums/user-role.enum';

export class TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: {
    id: number;
    email: string;
    name?: string;
    role: UserRole;
    managerId?: number | null; // Manager ID for team members
  };
  metadata?: {
    type?: string;
    managerId?: number;
    managerEmail?: string;
    storesCount?: number;
    redirectUrl?: string;
    [key: string]: any;
  } | null;
}
