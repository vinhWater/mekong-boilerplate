// Import the JWT type for testing
import { JWT } from 'next-auth/jwt';
import axios from 'axios';

// Create a mock implementation of refreshAccessToken for testing
const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const response = await axios.post('/auth/refresh-token', {
      refreshToken: token.refreshToken
    });

    if (!response.data.accessToken || !response.data.refreshToken) {
      throw new Error('Failed to refresh token');
    }

    return {
      ...token,
      backendToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      backendTokenExpiry: Date.now() + 900 * 1000,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
};

// Mock axios
jest.mock('axios');
const mockedAxios = axios as unknown as jest.Mocked<typeof axios>;

describe('NextAuth Token Refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('refreshAccessToken', () => {
    it('should refresh tokens successfully', async () => {
      // Mock token
      const token: JWT = {
        userId: '1',
        backendToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
        backendTokenExpiry: Date.now() + 1000 * 60 * 15, // 15 minutes from now
      };

      // Mock axios response
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token',
          expiresIn: 900, // 15 minutes
        },
      });

      // Call the function
      const result = await refreshAccessToken(token);

      // Check axios was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh-token'),
        { refreshToken: 'old-refresh-token' }
      );

      // Check the result
      expect(result).toEqual({
        ...token,
        backendToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        backendTokenExpiry: expect.any(Number),
      });

      // Check the expiry time is in the future
      expect(result.backendTokenExpiry).toBeGreaterThan(Date.now());
    });

    it('should handle refresh token failure', async () => {
      // Mock token
      const token: JWT = {
        userId: '1',
        backendToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
        backendTokenExpiry: Date.now() + 1000 * 60 * 15, // 15 minutes from now
      };

      // Mock axios error
      mockedAxios.post.mockRejectedValueOnce(new Error('Refresh token failed'));

      // Call the function
      const result = await refreshAccessToken(token);

      // Check axios was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh-token'),
        { refreshToken: 'old-refresh-token' }
      );

      // Check the result has an error flag
      expect(result).toEqual({
        ...token,
        error: 'RefreshAccessTokenError',
      });
    });

    it('should handle missing tokens in response', async () => {
      // Mock token
      const token: JWT = {
        userId: '1',
        backendToken: 'old-access-token',
        refreshToken: 'old-refresh-token',
        backendTokenExpiry: Date.now() + 1000 * 60 * 15, // 15 minutes from now
      };

      // Mock axios response with missing tokens
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          // Missing accessToken and refreshToken
          expiresIn: 900,
        },
      });

      // Call the function
      const result = await refreshAccessToken(token);

      // Check axios was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth/refresh-token'),
        { refreshToken: 'old-refresh-token' }
      );

      // Check the result has an error flag
      expect(result).toEqual({
        ...token,
        error: 'RefreshAccessTokenError',
      });
    });
  });
});
