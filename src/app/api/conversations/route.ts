import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';  // Use .env.local for this

// GET conversations and messages
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '1000';
  const offset = searchParams.get('offset') || '0';

  try {
    const token = request.cookies.get('authToken')?.value;  
    const backendRes = await fetch(`${API_BASE_URL}/conversations/?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token || ''}`, 
        'Content-Type': 'application/json',
      },
    });

    if (!backendRes.ok) {
      let errorData;
      try {
        errorData = await backendRes.json(); // Parse backend error
      } catch {
        errorData = {};
      }

      let errorMessage = errorData.detail || 'Failed to fetch conversations';
      if (backendRes.status >= 500) {
        errorMessage = 'An unexpected server error occurred while fetching conversations. Please try again later.'; // Generic for DB/server issues
      } 

      return NextResponse.json({ error: errorMessage }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE conversations and messages
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');  // Use query param for ID

  if (!conversationId) {
    return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
  }

  try {
    const token = request.cookies.get('authToken')?.value;
    const backendRes = await fetch(`${API_BASE_URL}/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token || ''}`,
      },
    });


    if (!backendRes.ok) {
      let errorData;
      try {
        errorData = await backendRes.json(); // Parse backend error
      } catch {
        errorData = {};
      }

      let errorMessage = errorData.detail || 'Failed to delete conversation';
      if (backendRes.status >= 500) {
        errorMessage = 'An unexpected server error occurred while deleting the conversation. Please try again later.'; // Generic for DB/server issues
      }

      return NextResponse.json({ error: errorMessage }, { status: backendRes.status });
    }


    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Proxy delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}