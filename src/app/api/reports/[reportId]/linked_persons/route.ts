import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest, context : { params: { reportId: string } }) {
  const params = await context.params;  
  const { reportId } = params;
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/linked_persons`, {
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

      let errorMessage = errorData.detail || 'Failed to fetch linked persons';
      if (response.status >= 500) {
        errorMessage = 'An unexpected server error occurred while fetching linked persons. Please try again later.';
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error in GET /api/reports/[reportId]/linked_persons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: { reportId: string } }) {
  const params = await context.params;
  const { reportId } = params;
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/linked_persons`, {
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

      let errorMessage = errorData.detail || 'Failed to add linked person';
      if (response.status >= 500) {
        errorMessage = 'An unexpected server error occurred while adding linked person. Please try again later.';
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error in POST /api/reports/[reportId]/linked_persons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { reportId: string } }) {
  const params = await context.params;
  const { reportId } = params;
  const { searchParams } = new URL(request.url);
  const personId = searchParams.get('person_id');  // Pass person_id as query param
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  if (!token || !personId) {
    return NextResponse.json({ error: 'Unauthorized or missing person_id' }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/linked_persons/${personId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      let errorMessage = errorData.detail || 'Failed to delete linked person';
      if (response.status >= 500) {
        errorMessage = 'An unexpected server error occurred while deleting linked person. Please try again later.';
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Proxy error in DELETE /api/reports/[reportId]/linked_persons:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}