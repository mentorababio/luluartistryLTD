import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';
import { getBookingById, updateBooking } from '@/lib/api/db';

interface CancelParams {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<CancelParams> }) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();

    const booking = getBookingById(id);
    if (!booking) {
      return errorResponse('Booking not found', 404);
    }

    // Check if user is owner of booking
    if (booking.userId !== user.id && user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
      return errorResponse('Booking cannot be cancelled in current status', 400);
    }

    const updated = updateBooking(id, {
      status: 'cancelled',
    });

    return successResponse(updated, 'Booking cancelled successfully');
  } catch (error) {
    return errorResponse('Failed to cancel booking', 500);
  }
}
