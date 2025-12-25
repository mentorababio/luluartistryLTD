import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

interface ProductParams {
  id: string;
}

/**
 * Proxy route for individual product operations
 * Forwards request to backend API
 */
export async function GET(request: NextRequest, { params }: { params: Promise<ProductParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/products/${id}`);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<ProductParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/products/${id}`);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<ProductParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/products/${id}`);
}
