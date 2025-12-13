import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api/response';
import { getFeaturedProducts } from '@/lib/api/db';

export async function GET(request: NextRequest) {
  try {
    const products = getFeaturedProducts();
    return successResponse(products);
  } catch (error) {
    return successResponse([]);
  }
}
