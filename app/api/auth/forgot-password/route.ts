import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getUserByEmail } from '@/lib/api/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return errorResponse('Email is required', 400);
    }

    const user = getUserByEmail(email);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    // In production, send an email with password reset link
    // For now, return success message
    return successResponse(
      { message: 'Password reset link sent to email' },
      'Check your email for password reset instructions'
    );
  } catch (error) {
    return errorResponse('Failed to process forgot password request', 500);
  }
}
