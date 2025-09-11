import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear the authToken cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}