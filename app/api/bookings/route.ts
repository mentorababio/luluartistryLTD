import { NextRequest } from 'next/server';
import { successResponse, errorResponse, createdResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';
import { createBooking, getUserBookings, checkAvailability } from '@/lib/api/db';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const bookings = getUserBookings(user.id);
    return successResponse(bookings);
  } catch (error) {
    return errorResponse('Failed to fetch bookings', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { service, artist, location, appointmentDate, timeSlot, notes } = body;

    if (!service || !artist || !location || !appointmentDate || !timeSlot) {
      return errorResponse('Missing required fields', 400);
    }

    // Check availability
    const isAvailable = checkAvailability(appointmentDate, location, artist.type);
    if (!isAvailable) {
      return errorResponse('No availability for selected date, location and artist', 400);
    }

    const booking = createBooking({
      userId: user.id,
      service,
      artist,
      location,
      appointmentDate,
      timeSlot,
      notes,
    });

    return createdResponse(booking, 'Booking created successfully');
  } catch (error) {
    return errorResponse('Failed to create booking', 500);
  }
}
