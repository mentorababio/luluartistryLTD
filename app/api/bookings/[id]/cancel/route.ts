import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

interface CancelParams {
  id: string;
}

/**
 * Proxy route for cancelling a booking
 * Forwards request to backend API
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<CancelParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/bookings/${id}/cancel`);
}
