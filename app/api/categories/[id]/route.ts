import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

interface CategoriesParams {
  id: string;
}

/**
 * Proxy route for individual category operations
 * Forwards request to backend API
 */
export async function GET(request: NextRequest, { params }: { params: Promise<CategoriesParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/categories/${id}`);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<CategoriesParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/categories/${id}`);
}
