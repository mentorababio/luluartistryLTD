import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get the authorization token your frontend client sent
  const authHeader = request.headers.get('authorization') || '';

  try {
    // Forward the request to your actual Render backend URL
    const response = await fetch('https://luluartistry-backend.onrender.com/api/orders/admin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader, // CRITICAL: This passes your admin token to Render
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}