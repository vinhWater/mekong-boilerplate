import { NextRequest } from 'next/server';
import { GET } from './route';
import { getToken } from 'next-auth/jwt';

// Mock next-auth/jwt
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;

describe('/api/auth/callback/email-login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to error page when email or token is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/callback/email-login');
    
    const response = await GET(request);
    
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/auth/error?error=InvalidLink');
  });

  it('should redirect to verify page when user is not logged in', async () => {
    mockGetToken.mockResolvedValue(null);
    
    const request = new NextRequest(
      'http://localhost:3000/api/auth/callback/email-login?email=test@example.com&token=abc123'
    );
    
    const response = await GET(request);
    
    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/auth/verify');
    expect(location).toContain('email=test%40example.com');
    expect(location).toContain('token=abc123');
    expect(location).toContain('force_verify=true');
  });

  it('should redirect to signout then verify when user is already logged in', async () => {
    mockGetToken.mockResolvedValue({
      userId: 'existing-user',
      role: 'manager',
    } as any);
    
    const request = new NextRequest(
      'http://localhost:3000/api/auth/callback/email-login?email=newuser@example.com&token=xyz789'
    );
    
    const response = await GET(request);
    
    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/logout');
    expect(location).toContain('callbackUrl=');
    expect(decodeURIComponent(location!)).toContain('/auth/verify');
    expect(decodeURIComponent(location!)).toContain('email=newuser@example.com');
    expect(decodeURIComponent(location!)).toContain('token=xyz789');
    expect(decodeURIComponent(location!)).toContain('force_verify=true');
  });

  it('should handle tiktok_redirect parameter', async () => {
    mockGetToken.mockResolvedValue(null);
    
    const request = new NextRequest(
      'http://localhost:3000/api/auth/callback/email-login?email=test@example.com&token=abc123&tiktok_redirect=%2Ftiktok-authorize'
    );
    
    const response = await GET(request);
    
    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/auth/verify');
    expect(location).toContain('tiktok_redirect=%2Ftiktok-authorize');
    expect(location).toContain('force_verify=true');
  });

  it('should handle tiktok_redirect parameter when user is logged in', async () => {
    mockGetToken.mockResolvedValue({
      userId: 'existing-user',
      role: 'manager',
    } as any);
    
    const request = new NextRequest(
      'http://localhost:3000/api/auth/callback/email-login?email=newuser@example.com&token=xyz789&tiktok_redirect=%2Ftiktok-authorize'
    );
    
    const response = await GET(request);
    
    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/logout');
    expect(decodeURIComponent(location!)).toContain('tiktok_redirect=%2Ftiktok-authorize');
    expect(decodeURIComponent(location!)).toContain('force_verify=true');
  });
});
