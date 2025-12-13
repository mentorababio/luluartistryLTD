import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';
import { getBookingById } from '@/lib/api/db';

interface BookingParams {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<BookingParams> }) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const booking = getBookingById(id);

    if (!booking) {
      return errorResponse('Booking not found', 404);
    }

    // Check if user is owner of booking or admin
    if (booking.userId !== user.id && user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    return successResponse(booking);
  } catch (error) {
    return errorResponse('Failed to fetch booking', 500);
  }
}
