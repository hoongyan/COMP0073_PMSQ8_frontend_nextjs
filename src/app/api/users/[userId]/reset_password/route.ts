import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest, context: { params: { userId: string } }) {
  const params = await context.params;
  const { userId } = params;
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/users/${userId}/reset-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      let errorMessage = errorData.detail || 'Failed to reset password';
      if (response.status >= 500) {
        errorMessage = 'An unexpected server error occurred while resetting the password. Please try again later.';
      } 

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Proxy error in POST /api/users/[userId]/reset-password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}