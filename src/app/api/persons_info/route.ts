import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '100';
  const offset = searchParams.get('offset') || '0';

  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/persons/?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      let errorMessage = errorData.detail || 'Failed to fetch persons';
      if (response.status >= 500) {
        errorMessage = 'An unexpected server error occurred while fetching persons. Please try again later.'; // Generic for DB/server issues
      } 

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error in GET /api/persons_info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/persons`, {
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

      let errorMessage = errorData.detail || 'Failed to create person';
      if (response.status >= 500) {
        errorMessage = 'An unexpected server error occurred while creating the person. Please try again later.'; // Generic for DB/server issues
      } 

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }


    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error in POST /api/persons_info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}