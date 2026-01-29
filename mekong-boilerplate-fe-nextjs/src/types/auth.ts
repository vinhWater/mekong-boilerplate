export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

export interface User {
  id: number | string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: UserRole;
  managerId?: number | null; // Team Management: Manager ID for members
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
