import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json(); // { email, password }
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; 

  try {
    const backendRes = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    const data = await backendRes.json();
    if (!backendRes.ok || !data.token) {
      let errorMessage = data.detail || 'Login failed';
      if (backendRes.status >= 500) {
        errorMessage = 'An unexpected server error occurred during signin. Please try again later.'; 
      } 

      return NextResponse.json({ error: errorMessage }, { status: backendRes.status });
    }

    // Set HttpOnly cookie with the token
    const maxAge = body.rememberMe ? 604800 : 3600;
    const response = NextResponse.json({ success: true, token_type: data.token_type });
    response.cookies.set('authToken', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Sign-in proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}