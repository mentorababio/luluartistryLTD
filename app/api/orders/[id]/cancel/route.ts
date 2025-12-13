import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';
import { getOrderById, updateOrder } from '@/lib/api/db';

interface CancelParams {
  id: string;
}

export async function PUT(request: NextRequest, { params }: { params: Promise<CancelParams> }) {
  try {
    const user = requireAuth(request);
    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { id } = await params;
    const body = await request.json();

    const order = getOrderById(id);
    if (!order) {
      return errorResponse('Order not found', 404);
    }

    // Check if user is owner of order
    if (order.userId !== user.id && user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return errorResponse('Order cannot be cancelled in current status', 400);
    }

    const updated = updateOrder(id, {
      status: 'cancelled',
    });

    return successResponse(updated, 'Order cancelled successfully');
  } catch (error) {
    return errorResponse('Failed to cancel order', 500);
  }
}
