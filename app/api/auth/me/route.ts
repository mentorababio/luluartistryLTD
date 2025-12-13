import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';
import { getUserById } from '@/lib/api/db';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const userData = getUserById(user.id);
    if (!userData) {
      return errorResponse('User not found', 404);
    }

    return successResponse({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
    });
  } catch (error) {
    return errorResponse('Failed to fetch user', 500);
  }
}
