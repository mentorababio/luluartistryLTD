import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';
import { updateUser, getUserById } from '@/lib/api/db';

export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { firstName, lastName, phone } = body;

    const updated = updateUser(user.id, {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(phone && { phone }),
    });

    if (!updated) {
      return errorResponse('User not found', 404);
    }

    return successResponse({
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
    });
  } catch (error) {
    return errorResponse('Failed to update profile', 500);
  }
}
