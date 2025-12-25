import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

/**
 * Proxy route for featured products
 * Forwards request to backend API
 */
export async function GET(request: NextRequest) {
  return proxyRequest(request, '/products/featured');
}
