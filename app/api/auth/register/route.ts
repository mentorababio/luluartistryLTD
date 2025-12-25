import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

/**
 * Proxy route for user registration
 * Forwards request to backend API
 */
export async function POST(request: NextRequest) {
  return proxyRequest(request, '/auth/register');
}
