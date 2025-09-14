import { NextRequest, NextResponse } from 'next/server';
import { fetch,Agent } from 'undici';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'; // Use non-public env var for server-side

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const agent = new Agent({  // Custom agent for timeouts
      headersTimeout: 600000,  // 10 minutes
      bodyTimeout: 600000,
      connectTimeout: 30000
    });

    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      dispatcher: agent
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      let errorMessage = errorData.detail || 'Failed to send message';
      if (response.status >= 500) {
        errorMessage = 'An unexpected server error occurred while sending the message. Please try again later.';
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error in POST /api/chat/message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}