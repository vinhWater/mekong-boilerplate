/**
 * Test file for proxy-image API route
 * This file contains unit tests for the image proxy functionality
 */

import { GET, OPTIONS } from './route';
import { NextRequest } from 'next/server';

// Mock fetch globally
global.fetch = jest.fn();

describe('/api/proxy-image', () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  describe('GET', () => {
    it('should return 400 when URL parameter is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/proxy-image');
      const response = await GET(request);

      expect(response.status).toBe(400);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      const body = await response.text();
      expect(body).toBe('Missing URL parameter');
    });

    it('should return 400 when URL format is invalid', async () => {
      const request = new NextRequest('http://localhost:3000/api/proxy-image?url=invalid-url');
      const response = await GET(request);

      expect(response.status).toBe(400);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      const body = await response.text();
      expect(body).toBe('Invalid URL format');
    });

    it('should successfully proxy image when valid URL is provided', async () => {
      const mockImageBuffer = new ArrayBuffer(100);
      const mockResponse = {
        ok: true,
        status: 200,
        arrayBuffer: jest.fn().mockResolvedValue(mockImageBuffer),
        headers: {
          get: jest.fn().mockReturnValue('image/jpeg'),
        },
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(mockResponse as any);

      const request = new NextRequest('http://localhost:3000/api/proxy-image?url=https://example.com/image.jpg');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Content-Type')).toBe('image/jpeg');
      expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600');
      
      // Verify fetch was called with correct parameters
      expect(fetch).toHaveBeenCalledWith('https://example.com/image.jpg', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TikTokShop-ImageProxy/1.0)',
        },
      });
    });

    it('should handle fetch errors gracefully', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error('Network error'));

      const request = new NextRequest('http://localhost:3000/api/proxy-image?url=https://example.com/image.jpg');
      const response = await GET(request);

      expect(response.status).toBe(500);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      const body = await response.text();
      expect(body).toBe('Failed to fetch image');
    });
  });

  describe('OPTIONS', () => {
    it('should return proper CORS headers for preflight request', async () => {
      const response = await OPTIONS();

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    });
  });
});