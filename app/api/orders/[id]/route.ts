import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

interface OrderParams {
  id: string;
}

/**
 * Proxy route for individual order operations
 * Forwards request to backend API
 */
export async function GET(request: NextRequest, { params }: { params: Promise<OrderParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/orders/${id}`);
}
