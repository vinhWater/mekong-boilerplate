import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy image endpoint to handle CORS issues with Photopea
 * This endpoint fetches images from external URLs and serves them with proper CORS headers
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  // Validate required parameters
  if (!imageUrl) {
    return new NextResponse('Missing URL parameter', { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  // Validate URL format
  try {
    new URL(imageUrl);
  } catch {
    return new NextResponse('Invalid URL format', { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  try {
    // Fetch the image from the external URL
    const response = await fetch(imageUrl, {
      headers: {
        // Add user agent to avoid blocking by some servers
        'User-Agent': 'Mozilla/5.0 (compatible; TikTokShop-ImageProxy/1.0)',
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.status} ${response.statusText}`, { 
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    
    // Get content type from the original response, fallback to image/jpeg
    const contentType = response.headers.get('Content-Type') || 'image/jpeg';

    // Return the image with proper CORS headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Cache the image for 1 hour to reduce external requests
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Failed to fetch image', { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}