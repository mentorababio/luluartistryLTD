import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  // In production, invalidate the token on the frontend
  return successResponse({ message: 'Logged out successfully' }, 'Logout successful');
}
