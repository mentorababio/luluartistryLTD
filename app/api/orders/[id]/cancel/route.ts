import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

interface CancelParams {
  id: string;
}

/**
 * Proxy route for cancelling an order
 * Forwards request to backend API
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<CancelParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/orders/${id}/cancel`);
}
