import { NextRequest } from 'next/server';
import { proxyRequest } from '@/lib/api/proxy';

/**
 * Proxy route for updating user profile
 * Forwards request to backend API
 */
export async function PUT(request: NextRequest) {
  return proxyRequest(request, '/auth/update-profile');
}
