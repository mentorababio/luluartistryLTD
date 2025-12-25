import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

interface StatusParams {
  id: string;
}

/**
 * Proxy route for updating order status
 * Forwards request to backend API
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<StatusParams> }) {
  const { id } = await params;
  return proxyRequest(request, `/orders/${id}/status`);
}
