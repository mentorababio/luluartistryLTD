import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth, requireAdmin } from '@/lib/api/auth';
import { getAllBookings } from '@/lib/api/db';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user || !requireAdmin(user)) {
      return errorResponse('Unauthorized', 401);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status') || undefined;
    const artist = url.searchParams.get('artist') || undefined;
    const service = url.searchParams.get('service') || undefined;

    const { bookings, total } = getAllBookings(page, limit, status, artist, service);

    return successResponse({ bookings, total });
  } catch (error) {
    return errorResponse('Failed to fetch bookings', 500);
  }
}
