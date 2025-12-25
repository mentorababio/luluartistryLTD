import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

/**
 * Proxy route for user logout
 * Forwards request to backend API
 */
export async function GET(request: NextRequest) {
  return proxyRequest(request, '/auth/logout');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, '/auth/logout');
}
