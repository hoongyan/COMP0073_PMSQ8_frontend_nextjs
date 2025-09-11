import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';


export async function GET(request: NextRequest, context: { params: { personId: string } }) {
  const params = await context.params;
  const { personId } = params;

  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  console.log('Auth token presence:', token ? 'Present' : 'Missing');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  try {
    const response = await fetch(`${API_BASE_URL}/persons/${personId}/linked_reports`, {
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

      let errorMessage = errorData.detail || 'Failed to fetch linked reports';
      if (response.status >= 500) {
        errorMessage = 'An unexpected server error occurred while fetching linked reports. Please try again later.'; // Generic for DB/server issues
      } 

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error in GET /api/persons/[personId]/linked_reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}