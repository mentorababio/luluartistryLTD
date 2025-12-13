import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth, requireAdmin } from '@/lib/api/auth';
import { getAllOrders } from '@/lib/api/db';

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request);
    if (!user || !requireAdmin(user)) {
      return errorResponse('Unauthorized', 401);
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status');

    const { orders, total } = getAllOrders(page, limit, status || undefined);

    return successResponse({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse('Failed to fetch orders', 500);
  }
}
