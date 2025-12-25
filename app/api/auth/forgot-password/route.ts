import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

/**
 * Proxy route for forgot password
 * Forwards request to backend API
 */
export async function POST(request: NextRequest) {
  return proxyRequest(request, '/auth/forgot-password');
}
