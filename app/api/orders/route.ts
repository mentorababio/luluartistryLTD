import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

/**
 * Proxy route for orders
 * Forwards request to backend API
 */
export async function GET(request: NextRequest) {
  // Forward query parameters
  const url = new URL(request.url);
  const queryString = url.search;
  return proxyRequest(request, `/orders${queryString}`);
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, '/orders');
}
