import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { getProductsByCategory, getCategoryById } from '@/lib/api/db';

interface CategoryParams {
  categoryId: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<CategoryParams> }) {
  try {
    const { categoryId } = await params;

    const category = getCategoryById(categoryId);
    if (!category) {
      return errorResponse('Category not found', 404);
    }

    const products = getProductsByCategory(categoryId);
    return successResponse(products);
  } catch (error) {
    return errorResponse('Failed to fetch products', 500);
  }
}
