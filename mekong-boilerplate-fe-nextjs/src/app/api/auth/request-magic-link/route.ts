import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Backend API URL
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Build callback URL
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/email-login`;

    // Request a magic link from the backend
    await axios.post(`${apiUrl}/auth/request-magic-link`, {
      email: email?.toLowerCase().trim(),
      redirectUrl: callbackUrl
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error requesting sign-in link:', error);
    
    // Check if it's an axios error with 503 maintenance response
    if (axios.isAxiosError(error) && error.response?.status === 503) {
      const data = error.response.data as any;
      if (data?.message === 'System is under maintenance. Please try again later.') {
        return NextResponse.json(
          { error: 'MAINTENANCE', message: data.message },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json({ error: 'Failed to request sign-in link' }, { status: 500 });
  }
}
