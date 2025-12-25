import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

/**
 * Proxy route for categories
 * Forwards request to backend API
 */
export async function GET(request: NextRequest) {
  return proxyRequest(request, '/categories');
}
