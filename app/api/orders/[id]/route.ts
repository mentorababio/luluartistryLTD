import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';
import { getOrderById, updateOrder, getUserOrders } from '@/lib/api/db';

interface OrderParams {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<OrderParams> }) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const order = getOrderById(id);

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    // Check if user is owner of order or admin
    if (order.userId !== user.id && user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    return successResponse(order);
  } catch (error) {
    return errorResponse('Failed to fetch order', 500);
  }
}
