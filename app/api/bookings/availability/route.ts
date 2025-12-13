import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api/response';
import { checkAvailability } from '@/lib/api/db';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const location = url.searchParams.get('location');
    const artistType = url.searchParams.get('artistType');

    if (!date || !location || !artistType) {
      return successResponse({ available: false, message: 'Missing required parameters' });
    }

    const available = checkAvailability(date, location, artistType);

    return successResponse({
      available,
      date,
      location,
      artistType,
      message: available ? 'Slots available' : 'No available slots',
    });
  } catch (error) {
    return successResponse({ available: false, message: 'Error checking availability' });
  }
}
