import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api/response';
import { getAllCategories } from '@/lib/api/db';

export async function GET(request: NextRequest) {
  try {
    const categories = getAllCategories();
    return successResponse(categories);
  } catch (error) {
    return successResponse([]);
  }
}
