import { DefaultSession } from "next-auth";
import { UserRole } from "./auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    backendToken?: string;
    refreshToken?: string;
    backendTokenExpiry?: number;
    error?: "RefreshAccessTokenError" | string;
    user: {
      id: string;
      role?: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    backendToken?: string;
    refreshToken?: string;
    role?: UserRole;
    databaseUserId?: number; // Database user ID từ backend
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    userId: string;
    backendToken?: string;
    refreshToken?: string;
    backendTokenExpiry?: number;
    error?: "RefreshAccessTokenError" | string;
    role?: UserRole;
  }
}
