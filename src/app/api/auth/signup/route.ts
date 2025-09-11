import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; // Use your .env var

  try {
    const backendRes = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      let errorData;
      try {
        errorData = await backendRes.json();
      } catch {
        errorData = {};
      }

      let errorMessage = errorData.detail || 'Signup failed';
      if (backendRes.status >= 500) {
        errorMessage = 'An unexpected server error occurred during signup. Please try again later.'; // Generic for DB/server issues
      }

      return NextResponse.json({ error: errorMessage }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data); 
  } catch (error) {
    console.error('Signup proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}