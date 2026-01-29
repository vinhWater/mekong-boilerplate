import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    return NextResponse.redirect(new URL('/auth/error?error=InvalidLink', request.url));
  }

  // Check if user is currently logged in
  const currentToken = await getToken({ req: request });

  // If user is logged in, we need to sign them out first
  if (currentToken) {
    console.log('[EmailCallback] User is currently logged in, will sign out first');

    // Build signout URL that will redirect back to verify after signout
    let verifyUrl = `/auth/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

    // Add force_verify parameter to bypass middleware redirect
    verifyUrl += '&force_verify=true';

    // Sign out and redirect to verify page using our logout page
    const signoutUrl = `/logout?callbackUrl=${encodeURIComponent(verifyUrl)}`;
    return NextResponse.redirect(new URL(signoutUrl, request.url));
  }

  // Build verify URL with email and token
  let verifyUrl = `/auth/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;

  // Add force_verify parameter to bypass middleware redirect
  verifyUrl += '&force_verify=true';

  return NextResponse.redirect(new URL(verifyUrl, request.url));
}
