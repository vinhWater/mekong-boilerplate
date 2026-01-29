# API Client with Automatic Token Refresh

This directory contains the API client implementation with automatic token refresh functionality for React Query.

## Overview

The implementation provides seamless token refresh for React Query requests without disrupting the user experience. When a 401 error occurs, the system automatically attempts to refresh the token using NextAuth's built-in mechanism before failing the request.

## Key Components

### 1. `api-client.ts`
- Main Axios client with request/response interceptors
- Automatic token refresh on 401 errors using NextAuth's `getSession()`
- Error handling and user notifications
- Direct integration with NextAuth's existing refresh mechanism

## How It Works

1. **Normal Request Flow**:
   - React Query hook calls `apiRequest()`
   - Request includes `session.backendToken` in Authorization header
   - Response is returned normally

2. **Token Expired Flow**:
   - API returns 401 Unauthorized
   - Response interceptor catches the error
   - Calls `getSession()` to trigger NextAuth's JWT callback
   - NextAuth automatically handles the backend token refresh via its `refreshAccessToken()` function
   - After refresh succeeds, retries the original request with new token
   - If refresh fails, signs out the user

3. **NextAuth Integration**:
   - Leverages NextAuth's existing `refreshAccessToken()` function in the route configuration
   - Calls `getSession()` to trigger NextAuth's JWT callback which handles token refresh
   - NextAuth automatically manages token expiry, refresh, and session updates
   - No additional token refresh utilities needed - uses NextAuth's built-in mechanism

## Features

- **Seamless User Experience**: Users don't see authentication errors during token refresh
- **NextAuth Integration**: Leverages NextAuth's built-in token refresh mechanism
- **Automatic Retry**: Failed requests are automatically retried with refreshed tokens
- **Error Handling**: Graceful fallback to sign-out if refresh fails
- **No Duplication**: Uses existing NextAuth functionality without additional complexity
- **React Query Optimized**: Configured retry logic for different error types

## Configuration

### React Query Settings
- Allows retry on 401 errors (since we handle token refresh)
- Exponential backoff for retries
- Different retry logic for queries vs mutations

### Token Refresh Settings
- Integrates with NextAuth's 15-minute token expiry
- Automatic refresh when tokens expire in < 1 minute
- 5-second delayed revocation to handle race conditions

## Usage in React Query Hooks

```typescript
export function useProducts() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiRequest({
      url: '/products',
      method: 'GET',
      token: session?.backendToken, // Automatically refreshed if expired
    }),
  });
}
```

## Error Handling

The system handles various error scenarios:

- **Network Errors**: Retried with exponential backoff
- **401 Unauthorized**: Automatic token refresh attempted
- **Other 4xx Errors**: Not retried (client errors)
- **5xx Errors**: Retried with exponential backoff
- **Token Refresh Failure**: User signed out with notification

## Security Considerations

- Tokens are only stored in NextAuth session (not localStorage)
- Refresh tokens are single-use and rotated
- Failed refresh attempts trigger immediate sign-out
- Request queuing prevents token leakage during refresh

## Testing

To test the token refresh functionality:

1. Log in to the application
2. Wait for token to expire (or manually expire it)
3. Make an API request
4. Verify the request succeeds after automatic refresh
5. Check network tab for refresh request

## Troubleshooting

Common issues:

- **Infinite Refresh Loop**: Check NextAuth configuration and token expiry times
- **Session Not Updated**: Verify NextAuth JWT callback is working
- **Queue Not Processing**: Check error handling in token refresh utility
- **Multiple Refresh Requests**: Verify debouncing logic is working
