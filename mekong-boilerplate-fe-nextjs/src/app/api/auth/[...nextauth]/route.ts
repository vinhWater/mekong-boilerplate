import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import axios from "axios";
import { JWT } from "next-auth/jwt";

// Define UserRole enum to match backend
enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

// Define metadata type for magic link
interface MagicLinkMetadata {
  type?: 'team_invitation' | 'tiktok_authorize' | string;
  managerId?: number;
  managerEmail?: string;
  storesCount?: number;
  redirectUrl?: string;
  [key: string]: any;
}

// Extend the User type to include our custom properties
declare module "next-auth" {
  interface User {
    backendToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    role?: UserRole;
    databaseUserId?: number; // Database user ID từ backend
    managerId?: number | null; // Manager ID for members
    metadata?: MagicLinkMetadata | null; // Magic link metadata
  }

  interface Session {
    backendToken?: string;
    refreshToken?: string;
    backendTokenExpiry?: number;
    error?: string;
    metadata?: MagicLinkMetadata | null; // Magic link metadata
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: UserRole;
      managerId?: number | null; // Manager ID for members
    };
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    refreshToken?: string;
    backendTokenExpiry?: number;
    role?: UserRole;
    managerId?: number | null; // Manager ID for members
    error?: string;
    metadata?: MagicLinkMetadata | null; // Magic link metadata
  }
}

// Backend API URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Maximum age of the session in seconds (30 days)
const MAX_AGE = 30 * 24 * 60 * 60;

// Biến toàn cục để theo dõi quá trình refresh token
let isRefreshingToken = false;
let refreshPromise: Promise<JWT> | null = null;

// Function to refresh the token
async function refreshAccessToken(token: JWT): Promise<JWT> {
  // Refresh access token using the backend API

  // Nếu đang refresh token, trả về promise hiện tại
  if (isRefreshingToken && refreshPromise) {
    return refreshPromise;
  }

  // Đánh dấu đang refresh token
  isRefreshingToken = true;

  // Tạo promise mới
  refreshPromise = (async () => {
    try {
      // Make a request to the token refresh endpoint with the refresh token
      const response = await axios.post(
        `${apiUrl}/auth/refresh-token`,
        {
          refreshToken: token.refreshToken
        },
        {
          withCredentials: true // Ensure cookies are sent with the request
        }
      );

      // Get the new tokens
      const { accessToken, refreshToken: newRefreshToken, expiresIn, user } = response.data;

      if (!accessToken || !newRefreshToken) {
        throw new Error("Failed to refresh token");
      }

      // Use expiresIn from backend response to stay synchronized
      const expiryTime = Date.now() + (expiresIn * 1000);

      // ✅ Update role and managerId from refresh token response
      const updatedToken = {
        ...token,
        backendToken: accessToken,
        refreshToken: newRefreshToken,
        backendTokenExpiry: expiryTime,
      };

      // Update user data if available in response
      if (user) {
        updatedToken.role = user.role;
        updatedToken.managerId = user.managerId;
        console.log('🔄 Token refreshed with updated user data:', {
          role: user.role,
          managerId: user.managerId,
        });
      }

      // ✅ Clear metadata after token refresh (invitation already processed)
      if (updatedToken.metadata) {
        delete updatedToken.metadata;
        console.log('🗑️ Metadata cleared after token refresh');
      }

      // Return the new tokens with updated expiry time and user data
      return updatedToken;
    } catch (error: any) {
      console.error("Error refreshing token:", error.message);

      // Return the original token with an expired flag
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    } finally {
      // Reset trạng thái sau khi hoàn thành
      isRefreshingToken = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // When a user signs in with Google, we'll register them in our backend
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      }
    }),

    // Provider for verifying magic links and authenticating users
    CredentialsProvider({
      id: "credentials",
      name: "Email Login",
      credentials: {
        email: { label: "Email", type: "email" },
        magicToken: { label: "Magic Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.magicToken) return null;

        try {
          // Verify the magic link token with the backend
          const response = await axios.post(`${apiUrl}/auth/verify-magic-link`, {
            email: credentials.email?.toLowerCase().trim(),
            token: credentials.magicToken
          });

          if (response.data.user) {
            // Add the tokens to the user object
            const user = response.data.user;
            user.backendToken = response.data.accessToken;
            user.refreshToken = response.data.refreshToken;
            user.expiresIn = response.data.expiresIn; // Lấy expiresIn từ backend
            user.metadata = response.data.metadata || null; // ✅ Lưu metadata từ backend
            return user;
          }

          return null;
        } catch (error) {
          console.error("Error verifying sign-in link:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // ✅ Send Google ID token to backend for verification
          // Backend will verify this token with Google before creating/updating the user
          const requestData = {
            provider: "google",
            idToken: account.id_token, // Google ID token (JWT)
          };

          // Register or login the user in our backend
          const response = await axios.post(`${apiUrl}/auth/oauth-login`, requestData);

          // Debug: Log the backend response
          console.log('🔍 Backend OAuth Response:', {
            hasAccessToken: !!response.data.accessToken,
            user: response.data.user,
            userIdType: typeof response.data.user?.id
          });

          // Store the tokens and role in the user object to be used in the jwt callback
          if (response.data.accessToken) {
            user.backendToken = response.data.accessToken;
            user.refreshToken = response.data.refreshToken;
            user.expiresIn = response.data.expiresIn; // Lấy expiresIn từ backend
            user.role = response.data.user?.role; // Đảm bảo luôn gán role từ backend
            user.managerId = response.data.user?.managerId || null; // Manager ID for members
            // IMPORTANT: Store the database user ID, not the Google Provider ID
            user.databaseUserId = response.data.user?.id; // Database user ID từ backend

            console.log('🔍 Stored databaseUserId:', user.databaseUserId, '(type:', typeof user.databaseUserId, ')');
            console.log('🔍 Stored role:', user.role, 'managerId:', user.managerId);
          } else {
            console.warn('No tokens in OAuth response');
          }
          return true;
        } catch (error: any) {
          console.error("Error during OAuth login with backend:", error);
          console.error("Error details:", error.response?.data || error.message);
          
          // Check for 503 maintenance error
          if (error.response?.status === 503) {
            const errorData = error.response?.data;
            const errorMessage = errorData?.message || '';
            
            // If it's a maintenance error, throw an error to redirect to maintenance page
            if (errorMessage === 'System is under maintenance. Please try again later.') {
              console.log('🔧 System is under maintenance, triggering redirect');
              // Return a special error to signal maintenance mode
              throw new Error('MAINTENANCE_MODE');
            }
          }
          
          // Check for 401 verification error (new)
          if (error.response?.status === 401) {
            console.error('🔒 Google token verification failed on backend');
            // Return false to show error to user
          }
          
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, trigger }) {
      // Initial sign in
      if (user) {
        // Use database user ID if available, otherwise fallback to provider ID
        const finalUserId = user.databaseUserId ? String(user.databaseUserId) : user.id;
        token.userId = finalUserId;

        console.log('🔍 JWT Callback - User ID Mapping:', {
          googleProviderId: user.id,
          databaseUserId: user.databaseUserId,
          finalUserId: finalUserId,
          finalUserIdType: typeof finalUserId
        });

        // If we have tokens from the signIn callback, store them
        if (user.backendToken) {
          token.backendToken = user.backendToken;
          token.refreshToken = user.refreshToken;
          // Use expiresIn from backend response to stay synchronized
          token.backendTokenExpiry = Date.now() + (user.expiresIn! * 1000);
        } else {
          console.warn('No tokens in user object');
        }

        // Add role to token if available from user object
        if (user.role) {
          token.role = user.role;
        }

        // Add managerId to token if available from user object
        if (user.managerId !== undefined) {
          token.managerId = user.managerId;
        }

        // ✅ Store metadata in JWT token
        if (user.metadata) {
          token.metadata = user.metadata;
          console.log('🔍 JWT Callback - Metadata stored:', user.metadata);
        }
      }

      // ✅ Handle session update trigger (when update() is called from frontend)
      if (trigger === 'update') {
        console.log('🔄 JWT Callback - Session update triggered, refreshing tokens to get fresh user data...');

        // Use refreshAccessToken to get new tokens AND fresh user data
        // This ensures session sync across all tabs via NextAuth's cookie mechanism
        const refreshedToken = await refreshAccessToken(token);

        // ✅ Clear metadata after session update (invitation already processed)
        if (refreshedToken.metadata) {
          console.log('🗑️ JWT Callback - Clearing metadata after session update');
          delete refreshedToken.metadata;
        }

        console.log('✅ JWT Callback - Session updated via token refresh:', {
          role: refreshedToken.role,
          managerId: refreshedToken.managerId,
          metadataCleared: !refreshedToken.metadata,
        });

        return refreshedToken;
      }

      // Check if token needs to be refreshed (if it expires in less than 1 minute)
      const shouldRefreshTime = Math.round((token.backendTokenExpiry as number) - Date.now());

      // Check if token is about to expire (less than 1 minute remaining)
      if (shouldRefreshTime < 60 * 1000 && token.backendToken && token.refreshToken) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId;
        if (token.backendToken) {
          session.backendToken = token.backendToken;
          session.refreshToken = token.refreshToken;
          session.backendTokenExpiry = token.backendTokenExpiry;
        }
        if (token.role) {
          session.user.role = token.role;
        }
        if (token.managerId !== undefined) {
          session.user.managerId = token.managerId;
        }
        if (token.error) {
          session.error = token.error;
        }
        // ✅ Expose metadata to session (only if exists in token)
        if (token.metadata) {
          session.metadata = token.metadata;
          console.log('🔍 Session Callback - Metadata exposed:', token.metadata);
        } else {
          // ✅ Remove metadata from session if not in token
          delete session.metadata;
        }
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Call backend logout endpoint to revoke refresh token
      if (token?.refreshToken && token?.backendToken) {
        try {
          await axios.post(`${apiUrl}/auth/logout`, {
            refreshToken: token.refreshToken
          }, {
            headers: {
              'Authorization': `Bearer ${token.backendToken}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.error('❌ Failed to revoke refresh token on backend:', error);
          // Don't throw error here as it would prevent the frontend logout
          // The frontend logout should still proceed even if backend call fails
        }
      } else {
        console.warn('⚠️ No refresh token or access token found in session during logout');
      }

      // Clear job store on signout to prevent showing previous user's jobs
      // This runs on the server side, so we need to clear the persisted storage
      // The client-side cleanup will be handled by the signOut callback
      console.log('🧹 Signout event: Job store will be cleared on client side');
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: "jwt",
    maxAge: MAX_AGE, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
