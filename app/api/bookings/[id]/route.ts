import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

interface BookingParams {
  id: string;
}

/**
 * Proxy route for individual booking operations
 * Forwards request to backend API
 */
export async function GET(request: NextRequest, { params }: { params: Promise<BookingParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/bookings/${id}`);
}
