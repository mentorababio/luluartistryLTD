import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

interface CategoryParams {
  categoryId: string;
}

/**
 * Proxy route for products by category
 * Forwards request to backend API
 */
export async function GET(request: NextRequest, { params }: { params: Promise<CategoryParams> }) {
  const { categoryId } = await params;
  return proxyRequest(request, `/products/category/${categoryId}`);
}
