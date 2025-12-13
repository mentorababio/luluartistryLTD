import { NextRequest } from 'next/server';
import { successResponse, errorResponse, createdResponse } from '@/lib/api/response';
import { requireAuth, requireAdmin } from '@/lib/api/auth';
import { createCategory } from '@/lib/api/db';

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user || !requireAdmin(user)) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return errorResponse('Category name is required', 400);
    }

    const category = createCategory({
      name,
      description: description || '',
    });

    return createdResponse(category);
  } catch (error) {
    return errorResponse('Failed to create category', 500);
  }
}
