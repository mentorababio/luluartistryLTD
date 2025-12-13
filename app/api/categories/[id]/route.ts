import { NextRequest } from 'next/server';
import { successResponse, errorResponse, createdResponse } from '@/lib/api/response';
import { requireAuth, requireAdmin } from '@/lib/api/auth';
import { getCategoryById, updateCategory, createCategory as dbCreateCategory } from '@/lib/api/db';

interface CategoriesParams {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<CategoriesParams> }) {
  try {
    const { id } = await params;
    const category = getCategoryById(id);

    if (!category) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(category);
  } catch (error) {
    return errorResponse('Failed to fetch category', 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<CategoriesParams> }) {
  try {
    const user = requireAuth(request);
    if (!user || !requireAdmin(user)) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();

    const updated = updateCategory(id, body);
    if (!updated) {
      return errorResponse('Category not found', 404);
    }

    return successResponse(updated);
  } catch (error) {
    return errorResponse('Failed to update category', 500);
  }
}
